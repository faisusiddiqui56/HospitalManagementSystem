using AppointMentBooking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppointMentBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly ApplicationDbContext Context;

        public DoctorController(ApplicationDbContext context)
        {
            Context = context;
        }
        [HttpPost("Create")]
        public IActionResult Create(doctor doctor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Context.doctors.Add(doctor);
            Context.SaveChanges();

            return Ok("Doctor Created Successfully");
        }

        [HttpPut("Edit/{id}")]
        public IActionResult Edit(int id, doctor doctor)
        {
            var existingdoctor = Context.doctors.FirstOrDefault(x => x.ID == id);

            if (existingdoctor == null)
            {
                return NotFound("Doctor Not Found");
            }

            existingdoctor.name = doctor.name;
            existingdoctor.email = doctor.email;
            existingdoctor.mobile = doctor.mobile;
            existingdoctor.speciality = doctor.speciality;

            Context.SaveChanges();

            return Ok("Doctor Updated Successfully");
        }

        [HttpGet("List")]
        public IActionResult List()
        {
            var list = Context.doctors.ToList();

            return Ok(list);
        }

        // Get by Id
        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            var Doctor = Context.doctors
                .FirstOrDefault(x => x.ID == id);

            if (Doctor == null)
            {
                return NotFound("Doctor Not Found");
            }
            return Ok(Doctor);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var doctor = Context.doctors.FirstOrDefault(x => x.ID == id);

            if (doctor == null)
            {
                return NotFound("Doctor Not Found");
            }
            Context.doctors.Remove(doctor);
            Context.SaveChanges();
            return Ok("Doctor Deleted Successfully");
        }
    }
}