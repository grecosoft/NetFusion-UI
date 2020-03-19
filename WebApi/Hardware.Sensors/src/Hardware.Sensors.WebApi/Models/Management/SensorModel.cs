namespace Hardware.Sensors.WebApi.Models.Management
{
    public class SensorModel
    {

        public string SensorId { get; private set; }
        public string SensorName { get; private set; }
        public bool IsActive { get; private set; }
        public string Version { get; private set; }
        public string Make { get; private set; }
        public string Model { get; private set; }

        public SensorModel()
        {

        }
    }
}
