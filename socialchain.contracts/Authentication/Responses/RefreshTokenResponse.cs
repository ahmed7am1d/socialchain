namespace socialchain.contracts.Authentication.Responses;

public record RefreshTokenResponse(
     string AccessToken,
     string RefreshToken
);