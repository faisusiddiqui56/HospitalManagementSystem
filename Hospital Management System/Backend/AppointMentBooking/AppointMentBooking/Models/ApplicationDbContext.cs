using AppointMentBooking.Services;
using Microsoft.EntityFrameworkCore;

namespace AppointMentBooking.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
        { }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Appointment> appointments { get; set; }
        public DbSet<doctor> doctors { get; set; }
        public DbSet<patient> patients { get; set; }
        
    }
}
