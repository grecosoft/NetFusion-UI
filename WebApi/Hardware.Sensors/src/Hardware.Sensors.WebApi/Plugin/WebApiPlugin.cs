using NetFusion.Bootstrap.Plugins;

namespace Hardware.Sensors.WebApi.Plugin
{
    public class WebApiPlugin : PluginBase
    {
        public override string PluginId => "97b56851-1dbe-4532-8f74-8a812796480f";
        public override PluginTypes PluginType => PluginTypes.HostPlugin;
        public override string Name => "WebApi REST Host";

        public WebApiPlugin()
        {
            Description = "WebApi host exposing REST/HAL based Web API.";
        }
    }
}