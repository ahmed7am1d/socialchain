using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using socialchain.infrastructure.DbContexts;

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
            //DbContext
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("SocialChainDB"),
                    x => x.MigrationsAssembly("socialchain.infrastructure"));
            });
            return services;
        }
    }
}
