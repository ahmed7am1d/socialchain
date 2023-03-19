using Newtonsoft.Json;
using socialchain.application.Common.Interfaces.Authentication;
using System.Security.Cryptography;
using System.Security.Claims;
using Nethereum.Hex.HexConvertors.Extensions;
using System.Text;
using Nethereum.Signer;
using Nethereum.Util;
using socialchain.application.Common.Interfaces.Persistence;
using socialchain.domain.Entities;
using socialchain.application.Common.Services;
using ErrorOr;
using socialchain.domain.Common.Errors;

namespace socialchain.application.Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IJwtTokenService _jwtTokenGenerator;
        private readonly IUserRepository _userRepository;
        private readonly IDateTimeProvider _dateTimeProvider;


        public AuthenticationService(IJwtTokenService jwtTokenGenerator, IUserRepository userRepository, IDateTimeProvider dateTimeProvider)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _userRepository = userRepository;
            _dateTimeProvider = dateTimeProvider;
        }

        public NonceResult Nonce(string accountAddress)
        {
            string nonce = DateTime.Now.ToString();
            var tempToken = _jwtTokenGenerator.GenerateToken(nonce, accountAddress);
            return new NonceResult(tempToken, GetMessage(accountAddress, nonce));
        }

        public ErrorOr<VerifyResult> Verify(string signature, string tempToken)
        {

            string filteredSignture = JsonConvert.DeserializeObject<string>(signature);
            var isValidJWT = _jwtTokenGenerator.ValidateJWT(tempToken);
            var jwtDecoded = _jwtTokenGenerator.DecodeJWT(tempToken);
            string accountAddress = "";
            string nonce = "";
            IEnumerable<Claim> claims = jwtDecoded.Claims;
            foreach (Claim claim in claims)
            {
                string claimType = claim.Type;
                string claimValue = claim.Value;
                if (claimType.Equals("ethereum_address"))
                {
                    accountAddress = claimValue;
                }
                if (claimType.Equals("nonce"))
                {
                    nonce = claimValue;
                }
            }
            var originalMessage = GetMessage(accountAddress, nonce);
            var signer = new EthereumMessageSigner();
            var recoveredAddress = signer.EncodeUTF8AndEcRecover(originalMessage, filteredSignture);
            //Recovering address from message and signture
            //if (recoveredAddress.ToLower().Equals(accountAddress.ToLower()))
            //{
            //    return Errors.Signture.UnVerifiedSignture;
            //}


            //[1]- Checks if the account address already exists - then just update the user refresh token and send back refresh token
            if (_userRepository.GetUserByAccountAddress(accountAddress) is User user)
            {
                _userRepository.SetUserRefreshToken(_jwtTokenGenerator.GenerateRefreshToken(), user, _dateTimeProvider.UtcNow, _dateTimeProvider.RefreshTokenExipryTime);
            }
            //User is new
            else
            {
                user = new User
                {
                    AccountAddress = accountAddress,
                    RefreshToken = _jwtTokenGenerator.GenerateRefreshToken(),
                    TokenCreated = DateTime.UtcNow,
                    TokenExpires = _dateTimeProvider.RefreshTokenExipryTime,
                };
                _userRepository.Add(user);
            }
            var jwtToken = _jwtTokenGenerator.GenerateToken(nonce, accountAddress);
            return new VerifyResult(jwtToken, user);
        }

        public string GetMessage(string accountAddress, string nonce)
        {
            return $"Plesae Sign this message for address {accountAddress}{nonce}";
        }

        public RefreshTokenResult UpdatedAccessToken(string refreshToken, string accessToken)
        {
            //[1]- Get the current user by refresh token
            var user = _userRepository.GetUserByRefreshToken(refreshToken);
            //[2]- Check that the user is not null (refresh token sended === to the one in db)
            if (user is null)
            {
                throw new Exception("Not authenticated user");
            }
            //[3]- Generate new (AccessToken + Refresh Token to user) 
            var isValidJWT = _jwtTokenGenerator.ValidateJWT(accessToken);
            var jwtDecoded = _jwtTokenGenerator.DecodeJWT(accessToken);
            string accountAddress = "";
            string nonce = "";
            IEnumerable<Claim> claims = jwtDecoded.Claims;
            foreach (Claim claim in claims)
            {
                string claimType = claim.Type;
                string claimValue = claim.Value;
                if (claimType.Equals("ethereum_address"))
                {
                    accountAddress = claimValue;
                }
                if (claimType.Equals("nonce"))
                {
                    nonce = claimValue;
                }
            }


            var newAccessToken = _jwtTokenGenerator.GenerateToken(nonce, accountAddress);
            var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            //[4]- Set new refresh token for the user 
            _userRepository.SetUserRefreshToken(newRefreshToken, user, _dateTimeProvider.UtcNow, _dateTimeProvider.RefreshTokenExipryTime);
            var newUser = _userRepository.GetUserByAccountAddress(accountAddress);

            //[5]- send the result back to api 
            return new RefreshTokenResult(
                newAccessToken,
                newUser
                );
        }
    }
}
