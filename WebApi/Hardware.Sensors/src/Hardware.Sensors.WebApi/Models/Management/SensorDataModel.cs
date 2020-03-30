using System;

namespace Hardware.Sensors.WebApi.Models.Management
{
    public class SensorDataModel
    {
        public string SensorId { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}