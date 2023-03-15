using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.application.Services.Cookies;
    public interface ICookiesService
    {
        CookieOptions GetRefreshTokenCookieOptions(DateTime refreshTokenExpiryDate);
        CookieOptions GetAccessTokenCookieOptions();
    }
