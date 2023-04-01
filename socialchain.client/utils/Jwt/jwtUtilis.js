import { jwtVerify } from "jose";
export const isValidJWT = async (jwtToken) => {
  var isValidJWT = false;
  try {
    const { payload } = await jwtVerify(
      jwtToken,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY)
    );
    isValidJWT = true;
  } catch (e) {
    console.log(e);
    isValidJWT = false;
  }
  return isValidJWT;
};
