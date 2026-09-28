const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const BUSINESS_MANAGE_SCOPE = 'https://www.googleapis.com/auth/business.manage';

function required(value, name) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function getAccessToken(env = process.env, googleApi = google) {
  if (env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    const auth = new googleApi.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [BUSINESS_MANAGE_SCOPE],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    const accessToken = typeof token === 'string' ? token : token?.token;
    if (!accessToken) throw new Error('Service account did not return an access token.');
    return accessToken;
  }

  const oauth2Client = new googleApi.auth.OAuth2(
    required(env.CLIENT_ID, 'CLIENT_ID'),
    required(env.CLIENT_SECRET, 'CLIENT_SECRET'),
    env.REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: required(env.REFRESH_TOKEN, 'REFRESH_TOKEN') });
  const token = await oauth2Client.getAccessToken();
  const accessToken = typeof token === 'string' ? token : token?.token;
  if (!accessToken) throw new Error('OAuth refresh did not return an access token.');
  return accessToken;
}

async function fetchLocationReviews({ accountId, locationId, accessToken, http = axios }) {
  const reviews = [];
  let pageToken;
  let totalReviewCount = 0;
  let averageRating = null;

  do {
    const response = await http.get(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { pageSize: 50, ...(pageToken ? { pageToken } : {}) },
      }
    );
    const data = response.data || {};
    reviews.push(...(data.reviews || []));
    totalReviewCount = data.totalReviewCount ?? totalReviewCount;
    averageRating = data.averageRating ?? averageRating;
    pageToken = data.nextPageToken;
  } while (pageToken);

  const positiveWrittenReviews = reviews
    .filter(
      (review) =>
        (review.starRating === 'FOUR' || review.starRating === 'FIVE') &&
        review.comment?.trim()
    )
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

  return { locationId, totalReviewCount, averageRating, reviews: positiveWrittenReviews };
}

async function buildReviewOutput({ env = process.env, http = axios, googleApi = google } = {}) {
  const accountId = required(env.ACCOUNT_ID, 'ACCOUNT_ID');
  const locations = {
    fourth_st: required(env.FOURTH_ST_LOCATION_ID, 'FOURTH_ST_LOCATION_ID'),
    south_creek: required(env.SOUTH_CREEK_LOCATION_ID, 'SOUTH_CREEK_LOCATION_ID'),
  };
  const accessToken = await getAccessToken(env, googleApi);
  const output = {};

  for (const [friendlyName, locationId] of Object.entries(locations)) {
    output[friendlyName] = await fetchLocationReviews({
      accountId,
      locationId,
      accessToken,
      http,
    });
  }
  return output;
}

async function main() {
  try {
    const output = await buildReviewOutput();
    fs.writeFileSync('./reviews.json', JSON.stringify(output, null, 2));
    console.log(
      `Wrote reviews.json for ${Object.keys(output).length} locations with ` +
        `${Object.values(output).reduce((sum, location) => sum + location.reviews.length, 0)} written four- and five-star reviews.`
    );
  } catch (error) {
    const detail = error.response?.data || error.message;
    if (detail?.error === 'invalid_grant' || String(detail).includes('invalid_grant')) {
      console.error(
        'Google OAuth refresh token is revoked or expired. Configure the service-account secrets and grant that service account Business Profile manager access.'
      );
    } else {
      console.error('Error fetching reviews:', detail);
    }
    process.exitCode = 1;
  }
}

module.exports = { buildReviewOutput, fetchLocationReviews, getAccessToken };

if (require.main === module) main();
