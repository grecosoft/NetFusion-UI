using Microsoft.Extensions.DependencyInjection;
using NetFusion.Bootstrap.Catalog;
using NetFusion.Bootstrap.Plugins;

namespace Hardware.Sensors.App.Plugin.Modules
{
    public class ServiceModule : PluginModule
    {
        public override void ScanPlugins(ITypeCatalog catalog)
        {
            catalog.AsImplementedInterface("Service", ServiceLifetime.Scoped);
        }
    }
}