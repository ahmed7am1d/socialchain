using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using socialchain.application.Common.Interfaces.Authentication;
using socialchain.application.Common.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.infrastructure.Authentication;
public class JwtTokenService : IJwtTokenService
{
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly JwtSettings _jwtSettings;
    public JwtTokenService(IDateTimeProvider dateTimeProvider, IOptions<JwtSettings> jwtOptions)
    {
        _dateTimeProvider = dateTimeProvider;
        _jwtSettings = jwtOptions.Value;
    }


    public string GenerateToken(string nonce, string? accountAddress)
    {
        var signingCredentials = new SigningCredentials
            (
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
            SecurityAlgorithms.HmacSha256
            );


        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Nonce,nonce),
                //Sub => whom the token refers to.
                new Claim("ethereum_address", accountAddress, ClaimValueTypes.String)

        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issure,
            audience: _jwtSettings.Audience,
            expires: _dateTimeProvider.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            claims: claims,
            signingCredentials: signingCredentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    public bool ValidateJWT(string jwtToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = false,
            ValidateAudience = false,
            ValidateIssuer = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret))
        };
        try
        {
            tokenHandler.ValidateToken(jwtToken, validationParameters, out var validatedToken);
            return true;
        }
        catch
        {
            return false;
        }
    }
    public ClaimsPrincipal DecodeJWT(string jwtToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = false,
            ValidateAudience = false,
            ValidateIssuer = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret))
        };
        try
        {
            var claimsPrincipal = tokenHandler.ValidateToken(jwtToken, validationParameters, out var validationToken);
            return claimsPrincipal;
        }
        catch
        {
            return null;
        }
    }
    public string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}
