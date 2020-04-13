using System;
using Hardware.Sensors.Domain.Entities;
using NetFusion.Messaging.Types;

namespace Hardware.Sensors.Domain.Commands
{
    public class RegisterCompanyCommand : Command<Company>
    {
        // Company Information:
        public string Name { get; set; }
        public string[] Services { get; set; }
        public string Url { get; set; }
        public int? NumberEmployees { get; set; }
        public DateTime? DateEstablished { get; set; }
        
        // Primary Corporate Address:
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}