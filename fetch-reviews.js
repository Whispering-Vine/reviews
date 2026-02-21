const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

(async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accountId = process.env.ACCOUNT_ID;

    // Friendly names -> location IDs
    const locations = {
      fourth_st: process.env.FOURTH_ST_LOCATION_ID,
      south_creek: process.env.SOUTH_CREEK_LOCATION_ID,
    };

    const missing = Object.entries(locations)
      .filter(([, id]) => !id)
      .map(([name]) => name);

    if (missing.length) {
      throw new Error(
        `Missing location ID env vars for: ${missing.join(', ')}. ` +
          `Set FOURTH_ST_LOCATION_ID and SOUTH_CREEK_LOCATION_ID in .env`
      );
    }

    const accessToken = (await oauth2Client.getAccessToken()).token;
    if (!accessToken) throw new Error('Failed to obtain access token.');

    const output = {};

    for (const [friendlyName, locationId] of Object.entries(locations)) {
      const response = await axios.get(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = response.data || {};
      let reviews = data.reviews || [];

      // These fields are returned by the endpoint (when available)
      const totalReviewCount = data.totalReviewCount ?? 0;
      const averageRating = data.averageRating ?? null;

      // Filter reviews: Only FOUR or FIVE stars and must have review text
      reviews = reviews.filter(
        (review) =>
          (review.starRating === 'FOUR' || review.starRating === 'FIVE') &&
          review.comment &&
          review.comment.trim().length > 0
      );

      // Sort reviews: Newest to oldest
      reviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

      output[friendlyName] = {
        locationId,
        totalReviewCount,
        averageRating,
        reviews,
      };
    }

    fs.writeFileSync('./reviews.json', JSON.stringify(output, null, 2));
    console.log('Wrote reviews.json with totals + average rating + reviews.');
  } catch (error) {
    console.error('Error fetching reviews:', error.response?.data || error.message);
    process.exit(1);
  }
})();
