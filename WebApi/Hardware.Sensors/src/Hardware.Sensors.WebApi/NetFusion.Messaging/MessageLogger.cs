using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hardware.Sensors.WebApi.NetFusion.Messaging
{
    public class MessageLogger : IMessageLogger
    {
        private readonly IMessageLogSink[] _messageLogSinks;
        
        public MessageLogger(IEnumerable<IMessageLogSink> messageLogSinks)
        {
            _messageLogSinks = messageLogSinks.ToArray();
        }

        public async Task Log(MessageLog messageLog)
        {
            foreach (var sink in _messageLogSinks)
            {
                await sink.ReceiveAsync(messageLog);
            }
        }
    }
}