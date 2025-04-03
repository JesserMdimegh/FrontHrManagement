import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat'; // Your .NET API
  
  constructor(private http: HttpClient) { }
  
  sendMessage(message: string): Observable<any> {
    return this.http.post(this.apiUrl, { message });
  }
  
  // For streaming responses
  sendMessageStreaming(message: string): Observable<string> {
    return new Observable(observer => {
      const eventSource = new EventSource(`${this.apiUrl}/stream?message=${encodeURIComponent(message)}`);
      
      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };
      
      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };
      
      return () => eventSource.close();
    });
  }
}