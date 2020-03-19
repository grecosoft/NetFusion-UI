using NetFusion.Bootstrap.Plugins;
using Hardware.Sensors.App.Plugin.Modules;

namespace Hardware.Sensors.App.Plugin
{
    public class AppPlugin : PluginBase
    {
        public override string PluginId => "e7af3c29-c8c1-4b8e-a337-400b68f92bf6";
        public override PluginTypes PluginType => PluginTypes.ApplicationPlugin;
        public override string Name => "Application Services Component";

        public AppPlugin()
        {
            AddModule<ServiceModule>();

            Description = "Plugin component containing the Microservice's application services.";
        }   
    }
}