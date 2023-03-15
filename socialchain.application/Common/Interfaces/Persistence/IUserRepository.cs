
using socialchain.domain.Entities;

namespace socialchain.application.Common.Interfaces.Persistence;
public interface IUserRepository
{
    User? GetUserByAccountAddress(string accountAddress);
    void Add(User user);
    bool SetUserRefreshToken(string refreshToken, User user, DateTime refreshTokenDateCreated, DateTime refreshTokenExpiryTime);
    User? GetUserByRefreshToken(string refreshToken);
}

