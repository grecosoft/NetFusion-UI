using System.Threading.Tasks;
using Hardware.Sensors.WebApi.NetFusion.Messaging;

namespace Hardware.Sensors.WebApi.Hubs
{
    public interface IMessageLogHub
    {
        Task LogMessage(MessageLog messageLog);
    }
}