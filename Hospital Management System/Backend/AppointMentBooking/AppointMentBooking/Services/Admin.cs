using System.ComponentModel.DataAnnotations;

namespace AppointMentBooking.Services
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
