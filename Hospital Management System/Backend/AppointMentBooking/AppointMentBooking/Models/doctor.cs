using System.ComponentModel.DataAnnotations;

namespace AppointMentBooking.Models
{
    public class doctor
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string mobile { get; set; }
        [Required]  
        public string speciality { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
