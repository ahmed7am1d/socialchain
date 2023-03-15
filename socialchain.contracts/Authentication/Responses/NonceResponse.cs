namespace socialchain.contracts.Authentication.Responses;

public record NonceResponse(
    string TempToken,
    string Message
);