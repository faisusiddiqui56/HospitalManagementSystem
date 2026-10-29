using System.ComponentModel.DataAnnotations;

namespace AppointMentBooking.Models
{
    public class patient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string mobile { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
