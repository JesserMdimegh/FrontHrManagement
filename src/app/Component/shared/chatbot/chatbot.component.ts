import { Component } from '@angular/core';
import { ChatbotService } from '../../../services/services/chatService.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [FormsModule],
})
export class ChatbotComponent {
  userMessage: string = '';
  botResponse: string = '';

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (this.userMessage.trim() === '') return;
    
    this.chatbotService.sendMessage(this.userMessage).subscribe(
      response => {
        this.botResponse = response; // Adjust based on API structure
      },
      error => {
        console.error('Error:', error);
        this.botResponse = 'An error occurred.';
      }
    );

    this.userMessage = ''; // Clear input
  }
}
