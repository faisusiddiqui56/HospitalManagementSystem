import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../services/ai.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.html',
  styleUrls: ['./ai-chat.css']
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') private chatBodyRef!: ElementRef;
  
  isOpen = false;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    // Initial greeting
    this.messages.push({
      text: 'Hello! I am your Smart Hospital Assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMessage = this.newMessage;
    this.messages.push({
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    });
    
    this.newMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.aiService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.reply,
          sender: 'ai',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messages.push({
          text: 'Sorry, I am having trouble connecting to the server right now.',
          sender: 'ai',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatBodyRef) {
        this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
