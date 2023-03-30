import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import SocialChainApiConstants from "./constants/api/SocialChainApiConstants";
export default async function middleware(nextRequest) {
  const jwt = nextRequest.cookies.get("accessToken")?.value.toString();

  //[1]- Make sure user has jwt otherwise forward to login
  if (!jwt) return NextResponse.redirect(new URL("/login", nextRequest.url));

  //[2]- If user already has jwt and trying to go to login page forward to home otherwise let him go to login
  if (jwt && nextRequest.nextUrl.pathname.includes("/login")) {
    console.log("login");
    try {
      await jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY)
      );
      return NextResponse.redirect(new URL("/home", nextRequest.url));
    } catch (error) {
      console.log(error);
    }
  }

  //[2]- Real authentication for user has jwt [checking that jwt is valid]
  //JWT Valid => check if it is expired
  //expired => call refresh and update tokens and send him where he want
  //JWT not valid => forward him to login
  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return NextResponse.next();
  } catch (error) {
    //[1-]Checking if JWT expired [Call refresh Token]
    if (error?.name === "JWTExpired") {
      //[2] if expired get access and refresh token
      const accessToken = nextRequest.cookies
        .get("accessToken")
        ?.value.toString();
      const refreshToken = nextRequest.cookies
        .get("refreshToken")
        ?.value.toString();
      //- call refreshToken end point to update access Token
      try {
        const resp = await fetch("http://localhost:5074/auth/refresh-token", {
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
        });
        if (resp.ok) {
          const data = await resp.json();
          const response = NextResponse.next();
          response.cookies.set("refreshToken", data.refreshToken);
          response.cookies.set("accessToken", data.accessToken);
          return response;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return NextResponse.redirect(new URL("/login", nextRequest.url));
  }
}

export const config = {
  matcher: ["/home"],
};
