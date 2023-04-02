using ErrorOr;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.application.Services.Authentication
{
    public interface IAuthenticationService
    {
        NonceResult Nonce(string accountAddress);
        ErrorOr<VerifyResult> Verify(string signature, string tempToken);
        RefreshTokenResult UpdatedAccessToken(string refreshToken,string accessToken);
        ErrorOr<RegistrationResult> IsRegistered(string accountAddress);
    }
}
