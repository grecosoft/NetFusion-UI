using Hardware.Sensors.App.Repositories;
using Hardware.Sensors.Domain.Entities;
using Hardware.Sensors.WebApi.Models;
using Hardware.Sensors.WebApi.Models.Management;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Messaging;
using NetFusion.Rest.Common;
using NetFusion.Rest.Docs;
using NetFusion.Rest.Resources;
using NetFusion.Rest.Server.Hal;

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/hardware/companies")]
    public class CompanyController : ControllerBase
    {
        private readonly IMessagingService _messaging;
        private readonly ICompanyRepository _companyRepo;
        
        public CompanyController(
            IMessagingService messaging,
            ICompanyRepository companyRepo)
        {
            _messaging = messaging;
            _companyRepo = companyRepo;
        }

        [HttpGet("all/ids")]
        public IActionResult GetContactIds()
        {
            return Ok(_companyRepo.GetAllCompanyIds());
        }
        
        /// <summary>
        /// Returns a specific registered company.
        /// </summary>
        /// <param name="id">The identity value of the company resource.</param>
        /// <returns>Company resource model.</returns>
        [HttpGet("{id}"), 
            ProducesResponseType(typeof(CompanyModel), StatusCodes.Status200OK),
            ProducesResponseType(typeof(LocationModel), StatusCodes.Status202Accepted),
            EmbeddedResource(typeof(CompanyModel), typeof(LocationModel), "current-address"),
            EmbeddedResource(typeof(CompanyModel), typeof(SensorModel), "active-sensors", true)]
        public IActionResult GetCompany(string id)
        {
            Company company = _companyRepo.ReadCompany(id);
            if (company == null)
            {
                return NotFound("Customer Not Found");
            }

            HalResource<CompanyModel> companyRes = BuildCompanyResource(company);
            return Ok(companyRes);
        }

        /// <summary>
        /// Registers new company.
        /// </summary>
        /// <param name="company">Object containing the data.</param>
        /// <returns></returns>
        [HttpPost("register")]
        public IActionResult RegisterCompany([FromBody]CompanyModel company)
        {
            // Company company = await _messaging.SendAsync(command);
            //
            // HalResource<CompanyModel> companyRes = BuildCompanyResource(company);
            // return Ok(companyRes);

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCompany(string id)
        {
            return Ok();
        }

        private static HalResource<CompanyModel> BuildCompanyResource(Company company)
        {
            var companyRes = CompanyModel.FromEntity(company).AsResource();
            
            // Embedded the corporate address:
            if (company.CorporateLocation != null)
            {
                var corpLocRes = LocationModel.FromEntity(company.CorporateLocation).AsResource();
                companyRes.EmbedResource(corpLocRes, "corp-location");
            }
            
            return companyRes;
        }
        
        public class CompanyMappings : HalResourceMap
        {
            protected override void OnBuildResourceMap()
            {
                Map<CompanyModel>()
                    .LinkMeta<CompanyController>(meta =>
                    {
                        meta.Url(RelationTypes.Self, (c, m) => c.GetCompany(m.CompanyId));
                        meta.Url("remove", (c, m) => c.DeleteCompany(m.CompanyId));
                    })
                    .LinkMeta<LocationController>(meta =>
                    {
                        meta.Url("locations", (c, m) => c.GetCompanyLocations(m.CompanyId));
                    });
            }
        }
    }
}