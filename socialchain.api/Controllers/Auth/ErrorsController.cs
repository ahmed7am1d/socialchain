using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace socialchain.api.Controllers.Auth;
public class ErrorsController : BaseApiController
{
    [Route("error")]
    public IActionResult Error()
    {
        //[1]- Catch the thrown exception from HttpContext 
        Exception? exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;

        return Problem(title:exception?.Message,statusCode:400);
    }

}

