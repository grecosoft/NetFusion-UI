namespace Hardware.Sensors.Domain.Entities
{
    public class Sensor
    {
        public string SensorId { get; set; }
        public string SensorName { get; set; }
        public bool IsActive { get; set; }
        public string Version { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }
}
