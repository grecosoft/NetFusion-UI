using System;
using Hardware.Sensors.WebApi.Models.Management;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Rest.Resources.Hal;

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/sensors")]
    public class SensorDataController : ControllerBase
    {

        [HttpGet("{id}/data")]
        public IActionResult GetSensorData(string id)
        {
            var data = new SensorDataModel
            {
                SensorId = id,
                LastUpdated = DateTime.UtcNow
            }.AsResource();

            return Ok(data);
        }
        
    }
}