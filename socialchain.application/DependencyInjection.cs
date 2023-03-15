using Microsoft.Extensions.DependencyInjection;
using socialchain.application.Services.Authentication;
using socialchain.application.Services.Cookies;

namespace socialchain.application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
    {
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<ICookiesService, CookiesService>();
        return services;
    }
}