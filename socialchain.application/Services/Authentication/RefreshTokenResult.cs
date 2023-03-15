﻿using socialchain.domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.application.Services.Authentication;

public record RefreshTokenResult(
    string AccessToken,
    User User
);

