using AppointMentBooking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppointMentBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext Context;

        public AppointmentController(ApplicationDbContext context)
        {
            Context = context;
        }
        [HttpPost("Create")]
        public IActionResult Create(Appointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Context.appointments.Add(appointment);
            Context.SaveChanges();

            return Ok("Appointment Created Successfully");
        }

        [HttpPut("Edit/{id}")]
        public IActionResult Edit(int id, Appointment appointment)
        {
            var existingAppointment = Context.appointments.FirstOrDefault(x => x.Id == id);

            if (existingAppointment == null)
            {
                return NotFound("Appointment Not Found");
            }

            existingAppointment.doctorid = appointment.doctorid;
            existingAppointment.patientid = appointment.patientid;
            existingAppointment.date = appointment.date;
            existingAppointment.time = appointment.time;
            existingAppointment.status = appointment.status;

            Context.SaveChanges();

            return Ok("Appointment Updated Successfully");
        }

        [HttpGet("List")]
        public IActionResult List()
        {
            var list = Context.appointments.Where(x => x.status != "Completed").ToList();

            return Ok(list);
        }
        [HttpGet("CompletedList")]
        public IActionResult CompletedList()
        {
            var list = Context.appointments.Where(x => x.status == "Completed").ToList();
            
            return Ok(list);
        }
        [HttpPut("CompletedList/{id}")]
        public IActionResult CompletedList(int id)
        {
            var data = Context.appointments.Find(id);
            data.status = "Completed";
            Context.SaveChanges();

            return Ok(new { message = "appointment marked completed" });
        }

        // Get by Id
        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            var appointment = Context.appointments.FirstOrDefault(x => x.Id == id);

            if (appointment == null)
            {
                return NotFound("Appointment Not Found");
            }
            return Ok(appointment);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var appointment = Context.appointments.FirstOrDefault(x => x.Id == id);

            if (appointment == null)
            {
                return NotFound("Appointment Not Found");
            }

            Context.appointments.Remove(appointment);
            Context.SaveChanges();
            return Ok("Appointment Deleted Successfully");
        }
    }
}