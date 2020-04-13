using Hardware.Sensors.Domain.Entities;

namespace Hardware.Sensors.App.Repositories
{
    public interface ICompanyRepository
    {
        string[] GetAllCompanyIds();
        Company ReadCompany(string id);
        void AddCompany(Company company);
        Location ReadLocation(string id);
    }
}