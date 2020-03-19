using NetFusion.Bootstrap.Plugins;
using Hardware.Sensors.Infra.Plugin.Modules;

namespace Hardware.Sensors.Infra.Plugin
{
    public class InfraPlugin : PluginBase
    {
        public override string PluginId => "33c496bb-b3d9-4d30-950e-df8d65bdfa2e";
        public override PluginTypes PluginType => PluginTypes.ApplicationPlugin;
        public override string Name => "Infrastructure Application Component";

        public InfraPlugin() {
            AddModule<RepositoryModule>();

            Description = "Plugin component containing the application infrastructure.";
        }
    }
}
