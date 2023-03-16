export const environment = {
  disableCors: process.env.DISABLE_CORS === 'true',
  corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN || '*',
  graphQLDeepLimit: Number(process.env.GRAPHQL_DEEP_LIMIT ?? '10'),
};
