// chatbot.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [CommonModule] // Add this line to make CommonModule available
})
export class ChatbotComponent {
  @Input() isVisible: boolean = true; // Receiving variable from parent

  @Output() closeChatbot = new EventEmitter<void>();

  toggleChatbot() {
    this.closeChatbot.emit(); // Notify parent to close chatbot
  }

}