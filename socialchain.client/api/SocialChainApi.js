import axios from "axios";
import SocialChainApiConstants from "@/constants/api/SocialChainApiConstants";

export default axios.create({
  baseURL: SocialChainApiConstants.SOCIAL_CHAIN_BASE_URL_PRODUCTION,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
