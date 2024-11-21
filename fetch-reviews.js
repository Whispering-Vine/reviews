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

    const accountId = process.env.ACCOUNT_ID; // Replace with your actual account ID
    const locationId = process.env.LOCATION_ID; // Replace with your actual location ID

    // Get access token
    const accessToken = (await oauth2Client.getAccessToken()).token;

    // Make the API request to fetch reviews
    const response = await axios.get(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let reviews = response.data.reviews || [];

    // Filter reviews: Only FOUR or FIVE stars and must have review text
    reviews = reviews.filter(
      (review) =>
        (review.starRating === 'FOUR' || review.starRating === 'FIVE') &&
        review.comment &&
        review.comment.trim().length > 0
    );

    // Sort reviews: Newest to oldest
    reviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

    // Save reviews to a JSON file in the repository
    const filePath = './reviews.json';
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));

    console.log(`Reviews saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching reviews:', error.response?.data || error.message);
    process.exit(1); // Exit with error code for CI/CD to handle
  }
})();