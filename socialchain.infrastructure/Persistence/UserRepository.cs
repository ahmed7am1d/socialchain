using Microsoft.EntityFrameworkCore;
using socialchain.application.Common.Interfaces.Persistence;
using socialchain.domain.Entities;
using socialchain.infrastructure.DbContexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.infrastructure.Persistence;
public class UserRepository : IUserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context)
    {
        _context = context;
    }

    public void Add(User user)
    {
        _context.Users.Add(user);
        try
        {
            _context.SaveChanges();
        }
        catch (Exception e)
        {
            Console.WriteLine("Can not save changes to add user => ",e);
        }
    }

    public User? GetUserByAccountAddress(string accountAddress)
    {
        return _context.Users.SingleOrDefault(x => x.AccountAddress.Equals(accountAddress));
    }

    public User? GetUserByRefreshToken(string refreshToken)
    {
        return _context.Users.SingleOrDefault(x => x.RefreshToken.Equals(refreshToken));
    }

    public  bool SetUserRefreshToken(string refreshToken, User user, DateTime refreshTokenDateCreated, DateTime refreshTokenExpiryTime)
    {
        var userDB = _context.Users.SingleOrDefault(u => u.AccountAddress == user.AccountAddress);

        userDB.RefreshToken = refreshToken;
        userDB.TokenExpires = refreshTokenExpiryTime;
        userDB.TokenCreated = refreshTokenDateCreated;

        _context.Entry(userDB).State = EntityState.Modified;
         _context.SaveChanges();
        return true;
    }
}

