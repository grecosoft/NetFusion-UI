using Hardware.Sensors.App.Repositories;
using Hardware.Sensors.Domain.Commands;
using Hardware.Sensors.Domain.Entities;
using NetFusion.Messaging;

namespace Hardware.Sensors.App.Handlers
{
    public class CompanyRegistration : IMessageConsumer
    {
        private readonly ICompanyRepository _companyRepo;
        
        public CompanyRegistration(ICompanyRepository companyRepo)
        {
            _companyRepo = companyRepo;
        }
        
        [InProcessHandler]
        public Company OnRegistration(RegisterCompanyCommand command)
        {
            var company = Company.Create(command.Name, command.Services)
                .AddDetails(command.Url, command.NumberEmployees, command.DateEstablished)
                .AddLocation(
                    Location.Create(command.AddressLine1, command.City, command.State, command.ZipCode)
                        .SetCorporate(true)
                        .SetAdditionalAddress(command.AddressLine2)
                );
            
            _companyRepo.AddCompany(company);
            return company;
        }
    }
}