using System.Threading.Tasks;
using Hardware.Sensors.WebApi.Models.EntryPoint;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Rest.Resources;
using NetFusion.Rest.Resources.Hal;
using NetFusion.Rest.Server.Hal;

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/entry")]
    public class EntryPointController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetEntryPoint()
        {
            // The root resource containing URLs defining entry points
            // used to initiate communication with the API.
            var rootEntryPoint = new EntryPointModel
            {
                Version = GetType().Assembly.GetName().Version.ToString()
            }.AsResource();

            // Child entry resources can be used to better organize
            // and group API specific set of Urls:
            rootEntryPoint.EmbedResource(new ManagmentEntryPoint().AsResource(), "management");
            rootEntryPoint.EmbedResource(new DataEntryPoint().AsResource(), "data");

            return Ok(rootEntryPoint);
        }

        public class EntityPointMappings : HalResourceMap
        {
            protected override void OnBuildResourceMap()
            {
                Map<EntryPointModel>()
                    .LinkMeta<SensorController>(meta =>
                    {
                        meta.UrlTemplate<string, Task<IActionResult>>("sensor", c => c.GetSensor);
                    });
            }
        }
    }
}
