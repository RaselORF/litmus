export default {
  environment: process.env.NODE_ENV,
  analytics: {
    url:
      process.env.ANALYTICS_API ||
      'https://staging-hub.litmuschaos.io/api/community',
  },
  cookies: {
    token: 'token',
  },
  grahqlEndpoint:
    process.env.REACT_APP_API_HOST || 'http://localhost:8080/query',
};
