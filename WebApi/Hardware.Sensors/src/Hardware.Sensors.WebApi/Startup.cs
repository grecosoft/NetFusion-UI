using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetFusion.Builder;
using NetFusion.Messaging.Plugin;
using NetFusion.Rest.Server.Plugin;
using NetFusion.Settings.Plugin;
using NetFusion.Web.Mvc.Plugin;
using Hardware.Sensors.App.Plugin;
using Hardware.Sensors.Domain.Plugin;
using Hardware.Sensors.Infra.Plugin;
using Hardware.Sensors.WebApi.Plugin;

namespace Hardware.Sensors.WebApi
{
    // Configures the HTTP request pipeline and bootstraps the NetFusion application container.
    public class Startup
    {
        // Microsoft Abstractions:
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        public void ConfigureServices(IServiceCollection services)
        {
            services.CompositeContainer(_configuration)
                .AddSettings()
                .AddMessaging()
                .AddWebMvc(config =>
                {
                    config.EnableRouteMetadata = true;
                })
                .AddRest()
 
                .AddPlugin<InfraPlugin>()
                .AddPlugin<AppPlugin>()
                .AddPlugin<DomainPlugin>()
                .AddPlugin<WebApiPlugin>()
                .Compose();

            services.AddCors();
            services.AddControllers();    
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            string viewerUrl = _configuration.GetValue<string>("Netfusion:ViewerUrl");
            if (! string.IsNullOrWhiteSpace(viewerUrl))
            {
                app.UseCors(builder => builder.WithOrigins(viewerUrl)
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithExposedHeaders("WWW-Authenticate","resource-404")
                    .AllowAnyHeader());
            }
            
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}