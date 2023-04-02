using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using socialchain.api.Controllers;
using socialchain.application.Services.Authentication;
using socialchain.contracts.Authentication.Requests;
using socialchain.contracts.Authentication.Responses;
using System.Net.Http.Headers;
using ErrorOr;
using socialchain.application.Services.Cookies;

namespace ToDo.Api.Controllers
{
    [Route("auth")]
    public class AuthenticationController : BaseApiController
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ICookiesService _cookiesService;
        public AuthenticationController(IAuthenticationService authenticationService, ICookiesService cookiesService)
        {
            _authenticationService = authenticationService;
            _cookiesService = cookiesService;
        }

        [HttpGet("nonce")]
        public IActionResult Nonce([FromQuery] NonceRequest request)
        {
            //Check if account address is already exists ()
            //Create JWT token (temp)
            var nonceResult = _authenticationService.Nonce(request.AccountAddress);
            var nonceResponse = new NonceResponse(nonceResult.TempToken, nonceResult.Message);
            return Ok(nonceResponse);
        }

        [HttpPost("verify")]
        public IActionResult Verify([FromBody] VerifyRequest verifyRequest, [FromHeader] string authorization)
        {
            //Get the tempToken from the header
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var parameter = headerValue.Parameter;
                if (parameter == null) return BadRequest();
                ErrorOr<VerifyResult> verifyResult = _authenticationService.Verify(verifyRequest.Signature, parameter);

                if (verifyResult.IsError)
                {
                    return Problem(verifyResult.Errors);
                }

                var cookieOptionsRefreshToken = _cookiesService.GetRefreshTokenCookieOptions(verifyResult.Value.User.TokenExpires);
                var cookieOptionsAccessToken = _cookiesService.GetAccessTokenCookieOptions();

                Response.Cookies.Append("refreshToken", verifyResult.Value.User.RefreshToken, cookieOptionsRefreshToken);
                Response.Cookies.Append("accessToken", verifyResult.Value.AccessToken, cookieOptionsAccessToken);

                var verifyResponse = new VerifyResponse(verifyResult.Value.User.AccountAddress, verifyResult.Value.AccessToken);
                return Ok(verifyResponse);
            }
            return BadRequest();
        }

        [HttpPost("refresh-token")]
        public IActionResult GetNewAccessToken([FromBody] RefreshTokenRequest refreshTokenRequest)
        {
            //[1]- Get the refresh token from the cookies 
            var refreshToken = refreshTokenRequest.RefreshToken;
            var accessToken = refreshTokenRequest.AccessToken;
            //[2]- Send to authetication services
            var refreshTokenResult = _authenticationService.UpdatedAccessToken(refreshToken, accessToken);
            //[3]- Return the response [Cookies will be set in the server side of nextjs]
            return Ok(new RefreshTokenResponse(refreshTokenResult.AccessToken, refreshTokenResult.User.RefreshToken));
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var accessToken = Request.Cookies["accessToken"];
            if (refreshToken is null && accessToken is null)
                return NoContent();
            //Deleting the cookies [it is important to pass same options as appending]
            var cookieOptionsRefreshToken = _cookiesService.GetRefreshTokenCookieOptions(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc));
            var cookieOptionsAccessToken = _cookiesService.GetAccessTokenCookieOptions();
            HttpContext.Response.Cookies.Delete("refreshToken", cookieOptionsRefreshToken);
            HttpContext.Response.Cookies.Delete("accessToken", cookieOptionsAccessToken);

            return NoContent();
        }

        [HttpGet("check-registration")]
        public IActionResult CheckUserRegistration([FromBody] IsRegisteredRequest isRegisterRequest)
        {
            ErrorOr<RegistrationResult> registeredResult = _authenticationService.IsRegistered(isRegisterRequest.AccountAddress);
            if (registeredResult.IsError)
            {
                return Problem(registeredResult.Errors);
            }
            return Ok(new IsRegisteredResponse(registeredResult.Value.IsRegistered));
        }
    }
}