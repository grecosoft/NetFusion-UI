using System;
using System.Collections.Generic;
using System.Linq;
using Hardware.Sensors.App.Repositories;
using Hardware.Sensors.Domain.Entities;

namespace Hardware.Sensors.Infra.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private static readonly List<Company> Companies;
        
        static CompanyRepository()
        {
            Companies = new List<Company>
            {
                Company.Create("Home Depot", "household supplies", "building materials")
                    .AddDetails("http://www.homedepot.com")
                    .AddLocation(
                        Location.Create("1055 N Colony Rd", "Wallingford", "CT", "06492").SetCorporate(true),
                        Location.Create("1055 N Colony Rd", "Lansdale", "PA", "19446")
                    )
            };
            
        }

        public string[] GetAllCompanyIds() => Companies.Select(c => c.CompanyId).ToArray();
        
        public Company ReadCompany(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("Value cannot be null or whitespace.", nameof(id));
            
            return Companies.FirstOrDefault(c => c.CompanyId == id);
        }

        public Location ReadLocation(string id)
        {
            return Companies.SelectMany(c => c.Locations).FirstOrDefault(l => l.LocationId == id);
        }

        public void AddCompany(Company company)
        {
            Companies.Add(company);
        }
    }
}