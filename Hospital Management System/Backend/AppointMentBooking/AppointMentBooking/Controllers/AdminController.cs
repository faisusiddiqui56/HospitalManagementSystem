using AppointMentBooking.Models;
using AppointMentBooking.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AppointMentBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext Context;
        private readonly IConfiguration Configuration;

        public AdminController(
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            Context = context;
            Configuration = configuration;
        }

        [Authorize]
        [HttpGet("List")]
        public IActionResult List()
        {
            var list = Context.Admins.ToList();
            return Ok(list);
        }

        [HttpPost("Login")]
        public IActionResult Login(Login login)
        {
            var admin = Context.Admins.FirstOrDefault(x =>x.Email == login.Email && x.Password == login.Password);

            if (admin == null)
            {
                return Unauthorized("Invalid Email or Password");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, admin.Email),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    Configuration["Jwt:Key"]!
                )
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: Configuration["Jwt:Issuer"],
                audience: Configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            var jwt = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return Ok(new
            {
                message = "Login Successfully",
                token = jwt
            });
        }

        [HttpGet("stats")]
        public IActionResult Dashboard()
        {
            var doctorCount = Context.doctors.Count();
            var patientCount = Context.patients.Count();
            var appointmentCount = Context.appointments.Count();
            var completedAppointmentCount = Context.appointments.Where(x => x.status == "Completed").Count();
            


            return Ok(new
            {
                doctor = doctorCount,
                patient = patientCount,
                appointment = appointmentCount,
                completedAppointment = completedAppointmentCount
            });
        }
    }
}