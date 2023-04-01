const SocialChainApiConstants = {
  //Base URL
  SOCIAL_CHAIN_BASE_URL: "https://localhost:7120",
  SOCIAL_CHAIN_BASE_URL_NOHTTPS :"http://localhost:5074",

  //Auth endpoints
  NONCE_ENDPOINT: "/auth/nonce",
  VERIFY_ENDPOINT: "/auth/verify",
  LOGOUT_ENDPOINT:"/auth/logout",
  REFRESHTOKEN_ENDPOINT: "/auth/refresh-token",
};

export default SocialChainApiConstants;
