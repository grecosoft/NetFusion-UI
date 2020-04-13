using System.Linq;
using Hardware.Sensors.App.Repositories;
using Hardware.Sensors.Domain.Entities;
using Hardware.Sensors.WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Rest.Common;
using NetFusion.Rest.Resources.Hal;
using NetFusion.Rest.Server.Hal;
using NetFusion.Web.Mvc.Metadata;

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/hardware/locations"), 
     GroupMeta(nameof(LocationController))]
    public class LocationController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepo;
        
        public LocationController(ICompanyRepository companyRepo)
        {
            _companyRepo = companyRepo;
        }
        
        [HttpGet("{id}"), ActionMeta(nameof(GetLocation))]
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

        [HttpGet("company/{id}")]
        public IActionResult GetCompanyLocations(string id)
        {
            Company company = _companyRepo.ReadCompany(id);
            var locationResources = company.Locations.Select(LocationModel.FromEntity)
                .Select(m => m.AsResource());
            
            var rootRes = HalResource.New(i => i.EmbedResources(locationResources.ToArray(), "locations"));
            return Ok(rootRes);
        }
        
        public class LocationMappings : HalResourceMap
        {
            protected override void OnBuildResourceMap()
            {
                Map<LocationModel>()
                    .LinkMeta<LocationController>(meta =>
                    {
                        meta.Url(RelationTypes.Self, (c, m) => c.GetLocation(m.LocationId));
                    });
            }
        }
    }
}