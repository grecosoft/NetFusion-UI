using NetFusion.Messaging.Types;

namespace Hardware.Sensors.Domain.Commands
{
    public class DeleteAddressCommand : Command
    {
        public string AddressId { get; }

        public DeleteAddressCommand(string id)
        {
            AddressId = id;
        }
    }
}
