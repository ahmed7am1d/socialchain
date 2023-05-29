const SocialChainApiConstants = {
  //Base URL
  SOCIAL_CHAIN_BASE_URL_PRODUCTION: "https://socialchainapi.azurewebsites.net",
  SOCIAL_CHAIN_BASE_URL_LOCAL:"http://localhost:5074",

  //Auth endpoints
  NONCE_ENDPOINT: "/auth/nonce",
  VERIFY_ENDPOINT: "/auth/verify",
  LOGOUT_ENDPOINT:"/auth/logout",
  REGISTERED_ENDPOINT:"/auth/check-registration",
  REFRESHTOKEN_ENDPOINT: "/auth/refresh-token",
};

export default SocialChainApiConstants;
