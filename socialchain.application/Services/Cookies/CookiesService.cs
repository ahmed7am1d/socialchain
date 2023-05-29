﻿using Microsoft.AspNetCore.Http;
using socialchain.application.Services.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.application.Services.Cookies;
public class CookiesService : ICookiesService
{

    public CookieOptions GetRefreshTokenCookieOptions(DateTime refreshTokenExpiryDate) => new CookieOptions
    {

        HttpOnly = true,
        Expires = refreshTokenExpiryDate,
        IsEssential = true,
        //For development:
        //Secure = false,
        //For production: (to enable only HTTPS) 
        Secure = true,
        MaxAge = TimeSpan.FromMilliseconds(1000),
        SameSite = SameSiteMode.None,
    };

    public CookieOptions GetAccessTokenCookieOptions() => new CookieOptions
    {
        HttpOnly = true,
        IsEssential = true,
        //For development:
        //Secure = false,
        //For production: (to enable only HTTPS) 
        Secure = true,
        MaxAge = TimeSpan.FromMilliseconds(1000),
        SameSite = SameSiteMode.None,
    };
}

