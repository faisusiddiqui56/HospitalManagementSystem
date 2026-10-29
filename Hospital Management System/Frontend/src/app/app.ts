import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AiChatComponent } from './ai-chat/ai-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AiChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    
}
