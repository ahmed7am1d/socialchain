using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.application.Services.Authentication;
public record NonceResult(
       string TempToken,
       string Message
    );

