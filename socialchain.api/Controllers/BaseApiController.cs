using ErrorOr;
using Microsoft.AspNetCore.Mvc;
using socialchain.api.Common.Http;

namespace socialchain.api.Controllers;

[ApiController]
public class BaseApiController : ControllerBase
{
    protected IActionResult Problem(List<Error> errors)
    {
        HttpContext.Items[HttpContextItemKeys.Erros] = errors;


        var firstError = errors[0];
        var statusCode = firstError.Type switch
        {
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            _ => StatusCodes.Status500InternalServerError,
        };
        return Problem(statusCode: statusCode, title: firstError.Description);
    }
}