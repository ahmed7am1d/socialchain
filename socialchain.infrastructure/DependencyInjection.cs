using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using socialchain.application.Common.Interfaces.Authentication;
using socialchain.application.Common.Interfaces.Persistence;
using socialchain.application.Common.Services;
using socialchain.infrastructure.Authentication;
using socialchain.infrastructure.Persistence;
using socialchain.infrastructure.Services;
using System.Text;

namespace socialchain.infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureLayer(this IServiceCollection services, ConfigurationManager configuration)
        {

            //services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
            services.AddAuth(configuration);
            services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
            services.AddScoped<IUserRepository, UserRepository>();
            return services;
        }

        public static IServiceCollection AddAuth(this IServiceCollection services, ConfigurationManager configuration)
        {
            //Gettings the configs from the json file 
            var jwtSettings = new JwtSettings();
            configuration.Bind(JwtSettings.SectionName, jwtSettings);

            services.AddSingleton(Options.Create(jwtSettings));
            services.AddSingleton<IJwtTokenService, JwtTokenService>();
            services.AddAuthentication(defaultScheme: JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issure,
                ValidAudience = jwtSettings.Audience,
                ClockSkew = TimeSpan.FromSeconds(0),
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.Secret))
            });
            return services;
        }
    }
}
