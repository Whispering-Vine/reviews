const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

(async () => {
  try {
    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // Set credentials (refresh token is required for automation)
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accountId = process.env.ACCOUNT_ID;

    // Two location IDs (Fourth St + South Creek)
    const locationIds = [
      process.env.FOURTH_ST_LOCATION_ID,
      process.env.SOUTH_CREEK_LOCATION_ID,
    ].filter(Boolean);

    if (locationIds.length !== 2) {
      throw new Error(
        `Expected exactly 2 location IDs. Found ${locationIds.length}. ` +
          `Set FOURTH_ST_LOCATION_ID and SOUTH_CREEK_LOCATION_ID in .env`
      );
    }

    // Get access token
    const accessToken = (await oauth2Client.getAccessToken()).token;
    if (!accessToken) throw new Error('Failed to obtain access token.');

    const reviewsByLocation = {};
    const totalsByLocation = {};

    for (const locationId of locationIds) {
      // Fetch reviews for a location
      const response = await axios.get(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      let reviews = response.data.reviews || [];
      const total = response.data.totalReviewCount ?? 0;

      // Filter reviews: Only FOUR or FIVE stars and must have review text
      reviews = reviews.filter(
        (review) =>
          (review.starRating === 'FOUR' || review.starRating === 'FIVE') &&
          review.comment &&
          review.comment.trim().length > 0
      );

      // Sort reviews: Newest to oldest
      reviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

      reviewsByLocation[locationId] = reviews;
      totalsByLocation[locationId] = { total };
    }

    // Write totals.json (parent keys are location IDs)
    fs.writeFileSync('./totals.json', JSON.stringify(totalsByLocation, null, 2));
    console.log('Totals saved to totals.json');

    // Write reviews.json (parent keys are location IDs)
    fs.writeFileSync('./reviews.json', JSON.stringify(reviewsByLocation, null, 2));
    console.log('Reviews saved to reviews.json');
  } catch (error) {
    console.error(
      'Error fetching reviews:',
      error.response?.data || error.message
    );
    process.exit(1); // Exit with error code for CI/CD to handle
  }
})();
