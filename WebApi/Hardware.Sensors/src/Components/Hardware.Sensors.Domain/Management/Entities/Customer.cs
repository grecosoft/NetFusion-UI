using System;
using System.Collections.Generic;

namespace Hardware.Sensors.Domain.Management.Entities
{
    public class Customer
    {
        public string CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Age { get; set; }
        public DateTime MemberDate { get; set; }
        public IEnumerable<Location> Locations { get; set; }
    }
}