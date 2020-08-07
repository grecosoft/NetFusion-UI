    using Hardware.Sensors.Domain.Entities;
    using Hardware.Sensors.WebApi.Models.Management;
    using NetFusion.Rest.Resources;

    namespace Hardware.Sensors.WebApi.Models
{
    /// <summary>
    /// Represents a company's location specified when the
    /// company was registered.
    /// </summary>
    [Resource("LocationRes")]
    public class LocationModel
    {
        /// <summary>
        /// Value identifying the location.
        /// </summary>
        public string LocationId { get; private set; }
        
        /// <summary>
        /// The company's address.
        /// </summary>
        public string Address { get; private set; }
        
        /// <summary>
        /// The city where the company is located.
        /// </summary>
        public string City { get; private set; }
        
        /// <summary>
        /// The where the company is located.
        /// </summary>
        public string State { get; private set; }
        
        /// <summary>
        /// The zip code for the company.
        /// </summary>
        public string ZipCode { get; private set; }
        
        
        public SensorModel Test2 { get; set; }

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