﻿
using System.ComponentModel.DataAnnotations;

namespace socialchain.domain.Entities;

public class User
{
    [Key]
    public string AccountAddress { get; set; } = null!;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime TokenCreated { get; set; }
    public DateTime TokenExpires { get; set; }
}

