const assert = require('node:assert/strict');
const test = require('node:test');

const { fetchLocationReviews, getAccessToken } = require('../fetch-reviews');

test('uses service-account credentials ahead of a revoked human refresh token', async () => {
  let options;
  const googleApi = {
    auth: {
      GoogleAuth: class {
        constructor(value) { options = value; }
        async getClient() {
          return { getAccessToken: async () => ({ token: 'service-token' }) };
        }
      },
      OAuth2: class {
        constructor() { throw new Error('OAuth fallback should not be used'); }
      },
    },
  };
  const token = await getAccessToken(
    {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: 'reviews@example.iam.gserviceaccount.com',
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: 'line1\\nline2',
      REFRESH_TOKEN: 'revoked-token',
    },
    googleApi
  );
  assert.equal(token, 'service-token');
  assert.equal(options.credentials.private_key, 'line1\nline2');
  assert.deepEqual(options.scopes, ['https://www.googleapis.com/auth/business.manage']);
});

test('paginates before filtering and sorting written positive reviews', async () => {
  const calls = [];
  const pages = [
    {
      reviews: [
        { reviewId: 'old-good', starRating: 'FOUR', comment: 'Lovely', createTime: '2026-01-01' },
        { reviewId: 'bad', starRating: 'ONE', comment: 'No', createTime: '2026-01-03' },
      ],
      totalReviewCount: 72,
      averageRating: 4.8,
      nextPageToken: 'page-2',
    },
    {
      reviews: [
        { reviewId: 'new-good', starRating: 'FIVE', comment: 'Great', createTime: '2026-01-04' },
        { reviewId: 'empty', starRating: 'FIVE', comment: '   ', createTime: '2026-01-05' },
      ],
    },
  ];
  const http = {
    async get(_url, options) {
      calls.push(options);
      return { data: pages[calls.length - 1] };
    },
  };
  const result = await fetchLocationReviews({
    accountId: 'account',
    locationId: 'location',
    accessToken: 'token',
    http,
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].params.pageToken, 'page-2');
  assert.deepEqual(result.reviews.map((review) => review.reviewId), ['new-good', 'old-good']);
  assert.equal(result.totalReviewCount, 72);
  assert.equal(result.averageRating, 4.8);
});
