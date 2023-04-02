using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.contracts.Authentication.Requests;

public record IsRegisteredRequest
(
    string AccountAddress
);

