using socialchain.application.Common.Interfaces.Persistence;
using socialchain.domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.infrastructure.Persistence;
public class UserRepository : IUserRepository
{
    private static readonly List<User> _users = new List<User>();
    public void Add(User user)
    {
        _users.Add(user);
    }

    public User? GetUserByAccountAddress(string accountAddress)
    {
        return _users.SingleOrDefault(x => x.AccountAddress.Equals( accountAddress));
    }

    public User? GetUserByRefreshToken(string refreshToken)
    {
        return _users.FirstOrDefault(x => x.RefreshToken.Equals( refreshToken));
    }

    public bool SetUserRefreshToken(string refreshToken, User user, DateTime refreshTokenDateCreated, DateTime refreshTokenExpiryTime)
    {
        var indexOfUser = _users.IndexOf(user);
        _users[indexOfUser].RefreshToken = refreshToken;
        _users[indexOfUser].TokenExpires = refreshTokenExpiryTime;
        _users[indexOfUser].TokenCreated = refreshTokenDateCreated;
        return true;
    }
}

