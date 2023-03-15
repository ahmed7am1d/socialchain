namespace socialchain.contracts.Authentication.Requests;

public record RefreshTokenRequest(
    string RefreshToken,
    string AccessToken
);