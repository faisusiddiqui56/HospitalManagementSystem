using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AppointMentBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AiController(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message cannot be empty.");
            }

            var apiKey = _configuration["AiSettings:GeminiApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                // Fallback or error if API key is not configured
                return StatusCode(500, "AI API key is not configured securely on the backend.");
            }

            try
            {
                // Call Gemini API (Using gemini-pro which is universally supported)
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";
                
                // Construct a universally compatible payload
                var systemInstruction = "You are the central AI assistant for this Hospital Management System. Respond quickly, smoothly, and politely to any questions the user asks about the project, the hospital, medical services, appointments, doctors, patients, or the medical store. Act like you know everything about this specific hospital project and provide helpful, confident answers. \n\nUser Question: ";
                
                var payload = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[] { new { text = systemInstruction + request.Message } }
                        }
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"Error calling AI provider: {errorResponse}");
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                
                // Parse the Gemini response
                using var doc = JsonDocument.Parse(responseBody);
                var textResponse = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return Ok(new ChatResponse { Reply = textResponse });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class ChatResponse
    {
        public string Reply { get; set; } = string.Empty;
    }
}
