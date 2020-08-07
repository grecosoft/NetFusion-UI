using System.Threading.Tasks;
using Hardware.Sensors.WebApi.Models.Management;
using Hardware.Sensors.WebApi.NetFusion.Messaging;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Rest.Common;
using NetFusion.Rest.Server.Hal;

#pragma warning disable 4014

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/sensors")]
    public class SensorController : ControllerBase
    {
        private readonly IMessageLogger _messageLogger;

        
        public SensorController(IMessageLogger messageLogger)
        {
            _messageLogger = messageLogger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSensor(string id)
        {
            var sensor = new SensorModel
            {
                SensorId = id,
                IsActive = true,
                Make = "DELL",
                Model = "Door Bell",
                SensorName = "Front Door",
                Version = "45.66.3"
            };

            var messageLog = new MessageLog
            {
                MessageType = "Hardware.Sensors.DataReceived"
            };

            await _messageLogger.Log(messageLog);


            return Ok(sensor.AsResource());
        }
        
        public class SensorMappings : HalResourceMap
        {
            protected override void OnBuildResourceMap()
            {
                Map<SensorModel>()
                    .LinkMeta<SensorController>(meta =>
                    {
                        meta.Url(RelationTypes.Self, (c, m) => c.GetSensor(m.SensorId));
                    })
                    .LinkMeta<SensorDataController>(meta =>
                    {
                        meta.Url("data", (c, m) => c.GetSensorData(m.SensorId));
                    });
            }
        }
    }
}
