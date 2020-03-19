using NetFusion.Bootstrap.Plugins;

namespace Hardware.Sensors.Domain.Plugin
{
    public class DomainPlugin : PluginBase
    {
        public override string PluginId => "440a8776-58e2-43e6-a8b4-db6a571c3ca8";
        public override PluginTypes PluginType => PluginTypes.ApplicationPlugin;
        public override string Name => "Domain Model Component";
        
        public DomainPlugin()
        {
            Description = "Plugin component containing the Microservice's domain model.";
        }
    }
}