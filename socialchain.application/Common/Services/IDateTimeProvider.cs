using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.application.Common.Services;
public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
    DateTime RefreshTokenExipryTime { get; }
}

