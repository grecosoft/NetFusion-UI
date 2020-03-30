using System.Threading.Tasks;
using Hardware.Sensors.WebApi.NetFusion.Messaging;
using Microsoft.AspNetCore.SignalR;

namespace Hardware.Sensors.WebApi.Hubs
{
    public class HubMessageLogSink : IMessageLogSink
    {
        private readonly IHubContext<MessageLogHub, IMessageLogHub> _hubContext;
        
        public HubMessageLogSink(IHubContext<MessageLogHub, IMessageLogHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public Task ReceiveAsync(MessageLog messageLog)
        {
            return _hubContext.Clients.All.LogMessage(messageLog);
        }
    }
}