using System;
using NetFusion.Rest.Resources;

namespace Hardware.Sensors.WebApi.Models.Management
{
    [Resource("SensorDataRes")]
    public class SensorDataModel
    {
        public string SensorId { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}