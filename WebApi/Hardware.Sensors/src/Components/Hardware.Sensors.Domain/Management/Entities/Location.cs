namespace Hardware.Sensors.Domain.Management.Entities
{
    public class Location
    {
        public string LocationId { get; set; }
        public bool IsPrimary { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}