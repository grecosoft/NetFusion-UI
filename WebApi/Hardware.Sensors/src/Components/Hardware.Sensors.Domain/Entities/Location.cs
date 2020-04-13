using System;

namespace Hardware.Sensors.Domain.Entities
{
    public class Location
    {
        public string LocationId { get; private set; }
        public bool IsCorporate { get; private set; }
        public string AddressLine1 { get; private set; }
        public string AddressLine2 { get; private set; }
        public string City { get; private set; }
        public string State { get; private set; }
        public string ZipCode { get; private set; }

        public static Location Create(string addressLine1, string city, string state, string zipCode)
        {
            return new Location
            {
                LocationId = Guid.NewGuid().ToString(),
                AddressLine1 = addressLine1,
                City = city,
                State = state,
                ZipCode = zipCode
            };
        }

        public Location SetAdditionalAddress(string addressLine2)
        {
            AddressLine2 = addressLine2;
            return this;
        }

        public Location SetCorporate(bool value)
        {
            IsCorporate = value;
            return this;
        }
    }
}