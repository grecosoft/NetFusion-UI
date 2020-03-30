using System.Threading.Tasks;

namespace Hardware.Sensors.WebApi.NetFusion.Messaging
{
    public interface IMessageLogSink
    {
        Task ReceiveAsync(MessageLog messageLog);
    }
}