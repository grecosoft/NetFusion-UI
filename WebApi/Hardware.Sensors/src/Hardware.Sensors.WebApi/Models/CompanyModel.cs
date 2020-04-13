using System.Collections.Generic;
using Hardware.Sensors.Domain.Entities;

namespace Hardware.Sensors.WebApi.Models
{
    public class CompanyModel
    {
        public string CompanyId { get; private set; }
        public string Name { get; private set; }
        public string MemberDate { get; private set; }
        public IEnumerable<string> Services { get; private set; }
        public string Url { get; private set; }
        public int? NumberEmployees { get; private set; }
        public string DateEstablished { get; private set; }

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