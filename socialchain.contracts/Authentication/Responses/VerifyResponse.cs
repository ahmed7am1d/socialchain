namespace socialchain.contracts.Authentication.Responses;

public record VerifyResponse(
    string AccountAddress,
    string AccessToken
);