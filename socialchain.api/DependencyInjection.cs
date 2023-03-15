using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace socialchain.api
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPresentationLayer(this IServiceCollection services, WebApplicationBuilder builder)
        {
            services.AddCors(o => o.AddPolicy("SocialChainPolicy", builder =>
            {
                builder.WithOrigins("http://localhost:3000", "http://localhost:3000/", "https://localhost:3000/",
                        "localhost:3000/")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
            }));
            builder.Services.AddControllers();
            builder.Services.AddSingleton<ProblemDetailsFactory, SocialChainProblemDetailsFactory>();
            return services;
        }
    }
}
