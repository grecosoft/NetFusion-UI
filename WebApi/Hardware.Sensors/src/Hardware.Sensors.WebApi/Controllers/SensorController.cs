using Hardware.Sensors.Domain.Management.Entities;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Rest.Resources.Hal;
using NetFusion.Web.Mvc.Metadata;

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/sensors"), GroupMeta("Sensor")]
    public class SensorController : ControllerBase
    {
        public SensorController()
        {
        }

        [HttpGet("{id}"), ActionMeta(nameof(GetSensor))]
        public IActionResult GetSensor(string sensorId)
        {
            var sensor = new Sensor
            {
                SensorId = sensorId,
                IsActive = true,
                Make = "DELL",
                Model = "Door Bell",
                SensorName = "Front Door",
                Version = "45.66.3"
            };


            return Ok(sensor.AsResource());
        }

    }
}
