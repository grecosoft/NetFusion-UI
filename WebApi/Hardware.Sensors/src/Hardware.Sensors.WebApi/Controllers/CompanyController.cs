using System.Threading.Tasks;
using Hardware.Sensors.App.Repositories;
using Hardware.Sensors.Domain.Commands;
using Hardware.Sensors.Domain.Entities;
using Hardware.Sensors.WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using NetFusion.Messaging;
using NetFusion.Rest.Common;
using NetFusion.Rest.Resources.Hal;
using NetFusion.Rest.Server.Hal;
using NetFusion.Web.Mvc.Metadata;

namespace Hardware.Sensors.WebApi.Controllers
{
    [ApiController, Route("api/hardware/companies"), 
     GroupMeta(nameof(CompanyController))]
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

        [HttpGet("all/ids"), ActionMeta(nameof(GetContactIds))]
        public IActionResult GetContactIds()
        {
            return Ok(_companyRepo.GetAllCompanyIds());
        }
        
        [HttpGet("{id}"), ActionMeta(nameof(GetCompany))]
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

        [HttpPost("register")]
        public async Task<IActionResult> RegisterCompany([FromBody]RegisterCompanyCommand command)
        {
            Company company = await _messaging.SendAsync(command);
            
            HalResource<CompanyModel> companyRes = BuildCompanyResource(company);
            return Ok(companyRes);
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
                    })
                    .LinkMeta<LocationController>(meta =>
                    {
                        meta.Url("locations", (c, m) => c.GetCompanyLocations(m.CompanyId));
                    });
            }
        }
    }
}