using System;
using System.Collections.Generic;
using System.Linq;

namespace Hardware.Sensors.Domain.Entities
{
    public class Company
    {
        public string CompanyId { get; private set; }
        public string Name { get; private set; }
        public DateTime MemberDate { get; private set; }
        public IEnumerable<string> Services { get; private set; }

        public IReadOnlyCollection<Contact> Contacts => _contacts;
        public IReadOnlyCollection<Location> Locations => _locations;
        
        public Company()
        {
            _contacts = new List<Contact>();
            _locations = new List<Location>();
        }
        
        public string Url { get; private set; }
        public int? NumberEmployees { get; private set; }
        public DateTime? DateEstablished { get; private set; }
        
        private readonly List<Contact> _contacts;
        private readonly List<Location> _locations;

        public static Company Create(string name, params string[] services)
        {
            return new Company
            {
                CompanyId = Guid.NewGuid().ToString(),
                Name = name,
                Services = services,
                MemberDate = DateTime.UtcNow
            };
        }

        public Company AddDetails(string url = null, int? numberEmployees = null, DateTime? dateEstablished = null)
        {
            Url = url;
            NumberEmployees = numberEmployees;
            DateEstablished = dateEstablished;
            return this;
        }

        public Company AddContact(Contact contact)
        {
            _contacts.Add(contact);
            return this;
        }

        public Company AddLocation(params Location[] locations)
        {
            _locations.AddRange(locations);
            return this;
        }

        public Location CorporateLocation => Locations.FirstOrDefault(l => l.IsCorporate);
    }
}