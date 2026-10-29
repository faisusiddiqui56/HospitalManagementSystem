import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  // Using the backend API URL. Make sure this matches where ASP.NET Core runs locally.
  // Standard port for .NET 8 might be different, but typically we proxy or use the full URL.
  // We'll use a generic one, assuming local testing URL for the backend.
  private apiUrl = 'http://localhost:5032/api/ai'; // Verify port from appsettings or launchSettings

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<AiChatResponse> {
    const request: AiChatRequest = { message };
    return this.http.post<AiChatResponse>(`${this.apiUrl}/chat`, request);
  }
}
