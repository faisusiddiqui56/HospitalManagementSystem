using System.ComponentModel.DataAnnotations;

namespace AppointMentBooking.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string doctorid { get; set; } 
        [Required]
        public string patientid { get; set; } 
        [Required]
        public DateOnly date { get; set; }
        [Required]
        public TimeOnly time { get; set; }
        public string status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}