using System.Threading.Tasks;

namespace Hardware.Sensors.WebApi.NetFusion.Messaging
{
    public interface IMessageLogger
    {
        Task Log(MessageLog messageLog);
    }
}