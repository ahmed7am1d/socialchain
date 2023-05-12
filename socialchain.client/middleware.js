import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import SocialChainApiConstants from "./constants/api/SocialChainApiConstants";
/**
 * Middleware function to protect the routing of the app and to check if user has a valid JWT access token.
 * If user has no token, they will be redirected to the login page.
 * If the token exits and is invalid or has expired, the user will be redirected to the login page,
 * unless they have enabled the "remember me" feature, in which case the function will try to refresh the access token by calling the back-end
 * after access token updated and refresh token return ok status user redirected to what he requested.
 *
 * @param {NextApiRequest} nextRequest - The Next.js API request object.
 * @returns {NextApiResponse>} A Next.js API response object.
 */
export default async function middleware(nextRequest) {
  //[1]- Make sure user has jwt otherwise forward to login
  const jwt = nextRequest.cookies.get("accessToken")?.value.toString();
  if (!jwt) return NextResponse.redirect(new URL("/login", nextRequest.url));

  try {
    await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY)
    );
    return NextResponse.next();
  } catch (error) {
    //[1]- Validate that the JWT token is issued from our secret key
    if (error?.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      return NextResponse.redirect(new URL("/login", nextRequest.url));
    } else {
      //-- The JWT is signed by our private key
      //-- Check if the jwt expired
      //JWT is Expired
      if (error?.code === "ERR_JWT_EXPIRED") {
        //Check if remember me exits
        //-- Exists => Get new access token using refresh token
        if (nextRequest.cookies.get("rememberMe")?.value === "true") {
          const accessToken = nextRequest.cookies
            .get("accessToken")
            ?.value.toString();
          const refreshToken = nextRequest.cookies
            .get("refreshToken")
            ?.value.toString();

          try {
            const resp = await fetch(
              "http://localhost:5074/auth/refresh-token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                }),
                credentials: "include",
                mode: "cors",
              }
            );
            if (resp.ok) {
              const data = await resp.json();
              const response = NextResponse.next();
              response.cookies.set("refreshToken", data.refreshToken);
              response.cookies.set("accessToken", data.accessToken);
              return response;
            }
          } catch (e) {
            console.log("Error when trying to update access token => ", e);
          }
        }
        //-- does not exists => kick user back to login
        else {
          return NextResponse.redirect(new URL("/login", nextRequest.url));
        }
      } else {
        //JWT is not expired
        //Continue with no problem
        const response = NextResponse.next();
        return response;
      }
    }
    return NextResponse.redirect(new URL("/login", nextRequest.url));
  }
}

export const config = {
  matcher: ["/home/:path*"],
};
