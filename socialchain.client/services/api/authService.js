import SocialChainApiConstants from "@/constants/api/SocialChainApiConstants";
import SocialChainApi from "@/api/SocialChainApi";

//Nonce endpoint
export const nonce = async (accountAddress) => {
  const response = await SocialChainApi.get(
    `${SocialChainApiConstants.NONCE_ENDPOINT}?accountaddress=${accountAddress}`
  );
  return response.data;
};

//Verify endpoint
export const verify = async (tempToken, signature) => {
  const headers = {
    Authorization: `Bearer ${tempToken}`,
  };

  const body = {
    signature: JSON.stringify(signature),
  };
  try {
    const response = await SocialChainApi.post(
      SocialChainApiConstants.VERIFY_ENDPOINT,
      body,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.log("Printing the Error message => ", error?.response);
    //return error message
    return await error?.response;
  }
};

//Refresh token
export const refreshToken = async () => {
  try {
    const response = await SocialChainApi.post(
      SocialChainApiConstants.REFRESHTOKEN_ENDPOINT
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

//Logout
export const logOut = async () => {
  try {
    const response = await SocialChainApi.post(
      SocialChainApiConstants.LOGOUT_ENDPOINT
    );
  } catch (error) {}
};

//Checking user is registered
export const isRegisteredUser = async (accountAddress) => {
  try {
    const response = await SocialChainApi.get(
      `${SocialChainApiConstants.REGISTERED_ENDPOINT}?accountaddress=${accountAddress}`
    );
    
  } catch (error) {
    //return error message
    return await error?.response?.data?.errors[0].description;
  }
  return false;
};
