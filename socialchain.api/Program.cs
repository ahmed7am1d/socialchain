using socialchain.api;
using socialchain.application;
using socialchain.infrastructure;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddPresentationLayer(builder);
    builder.Services.AddApplicationLayer();
    builder.Services.AddInfrastructureLayer(builder.Configuration); 
}


var app = builder.Build();
{
    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {

    }
    if (app.Environment.IsProduction())
    {
        //Disabled for the purpose of the nextjs api [local host no https]  BUT IT IS ALREADY INSIDE PRODUCTION
        app.UseHttpsRedirection();
    }
    app.UseExceptionHandler("/error");
    app.UseCors("SocialChainPolicy");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}