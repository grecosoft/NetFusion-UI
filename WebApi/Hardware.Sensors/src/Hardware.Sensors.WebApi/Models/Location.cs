using Hardware.Sensors.Domain.Entities;

namespace Hardware.Sensors.WebApi.Models
{
    public class LocationModel
    {
        public string LocationId { get; private set; }
        public string Address { get; private set; }
        public string City { get; private set; }
        public string State { get; private set; }
        public string ZipCode { get; private set; }

        public static LocationModel FromEntity(Location entity)
        {
            return new LocationModel
            {
                LocationId = entity.LocationId,
                Address = entity.AddressLine1,
                City = entity.City,
                State = entity.State,
                ZipCode = entity.ZipCode
            };
        }
    }
}