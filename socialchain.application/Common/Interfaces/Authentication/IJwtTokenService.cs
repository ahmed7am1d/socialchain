using System.Security.Claims;
using System.Security.Cryptography;

namespace socialchain.application.Common.Interfaces.Authentication;

public interface IJwtTokenService
{
    string GenerateToken(string nonce, string? accountAddress);
    public bool ValidateJWT(string jwtToken);
    public ClaimsPrincipal DecodeJWT(string jwtToken);
    public string GenerateRefreshToken();
}