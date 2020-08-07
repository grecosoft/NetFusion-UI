using System.Linq;
using System.Threading.Tasks;
using Hardware.Sensors.App.Repositories;
using Hardware.Sensors.Domain.Commands;
using Hardware.Sensors.Domain.Entities;
using Hardware.Sensors.WebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Messaging;
using NetFusion.Rest.Common;
using NetFusion.Rest.Docs;
using NetFusion.Rest.Resources;
using NetFusion.Rest.Server.Hal;
#pragma warning disable 4014

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/hardware/locations")]
    public class LocationController : ControllerBase
    {
        private readonly IMessagingService _messaging;
        private readonly ICompanyRepository _companyRepo;
        
        public LocationController(
            IMessagingService messaging,
            ICompanyRepository companyRepo)
        {
            _messaging = messaging;
            _companyRepo = companyRepo;
        }
        
        [HttpGet("{id}")]
        public IActionResult GetLocation(string id)
        {
            Location location = _companyRepo.ReadLocation(id);
            if (location == null)
            {
                NotFound("Location Not Found");
            }

            var model = LocationModel.FromEntity(location);
            return Ok(model.AsResource());
        }

        /// <summary>
        /// Returns all the locations registered for a company.
        /// </summary>
        /// <param name="id">Value identifying the company.</param>
        /// <returns>Returns a resource containing list of associated location resources.</returns>
        [HttpGet("company/{id}"),
            ProducesResponseType(typeof(CompanyModel), StatusCodes.Status200OK),
            EmbeddedResource(typeof(CompanyModel), typeof(LocationModel), "company-locations")]
        public IActionResult GetCompanyLocations(string id)
        {
            Company company = _companyRepo.ReadCompany(id);
            var locationResources = company.Locations.Select(LocationModel.FromEntity)
                .Select(m => m.AsResource());
            
            var rootRes = HalResource.New(i => i.EmbedResources(locationResources.ToArray(), "locations"));
            return Ok(rootRes);
        }

        /// <summary>
        /// Removes a company related location.
        /// </summary>
        /// <param name="id">The value identifying the location to be removed.</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveLocation(string id)
        {
            var command = new DeleteAddressCommand(id);

            await _messaging.SendAsync(command);
            return Ok();
        }

        public class LocationMappings : HalResourceMap
        {
            protected override void OnBuildResourceMap()
            {
                Map<LocationModel>()
                    .LinkMeta<LocationController>(meta =>
                    {
                        meta.Url(RelationTypes.Self, (c, m) => c.GetLocation(m.LocationId));
                        meta.Url("remove", (c, m) => c.RemoveLocation(m.LocationId));
                    });
            }
        }
    }
}