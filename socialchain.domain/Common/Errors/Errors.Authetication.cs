using ErrorOr;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace socialchain.domain.Common.Errors;
public static class Errors
{
    public static class Signture
    {
        public static Error UnVerifiedSignture = Error.Validation(
            code: "Signture.Unverified",
            description: "The signutre is not signed by the same person !");
    }

    public static class Registration
    {
        public static Error UnRegistered = Error.Validation(
            code: "Registration.UnRegisteredUser",
            description: "You are not registered user !"
            );
    }
}

