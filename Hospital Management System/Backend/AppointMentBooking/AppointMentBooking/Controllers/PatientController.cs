using AppointMentBooking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppointMentBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext Context;

        public PatientController(ApplicationDbContext context)
        {
            Context = context;
        }
        [HttpPost("Create")]
        public IActionResult Create(patient patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Context.patients.Add(patient);
            Context.SaveChanges();

            return Ok("Patient Created Successfully");
        }

        [HttpPut("Edit/{id}")]
        public IActionResult Edit(int id, patient patient)
        {
            var existingpatient = Context.patients.FirstOrDefault(x => x.Id == id);

            if (existingpatient == null)
            {
                return NotFound("Patient Not Found");
            }

            existingpatient.name = patient.name;
            existingpatient.email = patient.email;
            existingpatient.mobile = patient.mobile;

            Context.SaveChanges();
            return Ok("Patient Updated Successfully");
        }

        [HttpGet("List")]
        public IActionResult List()
        {
            var list = Context.patients.ToList();

            return Ok(list);
        }

        // Get by Id
        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            var patient = Context.patients.FirstOrDefault(x => x.Id == id);

            if (patient == null)
            {
                return NotFound("Patient Not Found");
            }
            return Ok(patient);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var patient = Context.patients.FirstOrDefault(x => x.Id == id);

            if (patient == null)
            {
                return NotFound("patient Not Found");
            }
            Context.patients.Remove(patient);
            Context.SaveChanges();
            return Ok("Patient Deleted Successfully");
        }
    }
}