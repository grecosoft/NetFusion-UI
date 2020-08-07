using System.Collections.Generic;
using Hardware.Sensors.Domain.Entities;
using NetFusion.Rest.Resources;

namespace Hardware.Sensors.WebApi.Models
{
    /// <summary>
    /// Company resource containing information about the company
    /// having registered devices for monitoring.
    /// </summary>
    [Resource("CompanyRes")]
    public class CompanyModel
    {
        /// <summary>
        /// The identity value of the company.
        /// </summary>
        public string CompanyId { get; private set; }
        
        /// <summary>
        /// The company's registered business name.
        /// </summary>
        public string Name { get; private set; }
        
        /// <summary>
        /// The date the company was registered for device monitoring.
        /// </summary>
        public string MemberDate { get; private set; }
        
        /// <summary>
        /// List of services provided by the company.
        /// </summary>
        public IEnumerable<string> Services { get; private set; }
        
        /// <summary>
        /// The URL to the company's many contact page.
        /// </summary>
        public string Url { get; private set; }
        
        /// <summary>
        /// The number of employees employed at the company.
        /// This value is updated yearly.
        /// </summary>
        public int? NumberEmployees { get; private set; }
        
        /// <summary>
        /// The date the company started doing business.
        /// </summary>
        public string DateEstablished { get; private set; }
        
        public LocationModel ChildTest { get; private set; }

        public static CompanyModel FromEntity(Company entity)
        {
            return new CompanyModel
            {
                CompanyId = entity.CompanyId,
                Name = entity.Name,
                Services = entity.Services,
                Url = entity.Url ?? "",
                NumberEmployees = entity.NumberEmployees,
                DateEstablished = entity.DateEstablished?.ToShortDateString() ?? "N/A",
                MemberDate = entity.MemberDate.ToShortDateString()
            };
        }
    }
}