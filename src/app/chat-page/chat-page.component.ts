import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../SERVICES/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../SERVICES/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
export interface Message{
  uid:string;
  date:Date;
  message:string;
  roomId:string;
}
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit{
  roomId: string = ''; 
  private messagesSubscription!: Subscription; 
state:any
user!:User | any | null
  constructor(private router:Router,private afs:AngularFirestore, 
    private authService:AuthService,private auth: AngularFireAuth
  ){
    this.state =  this.router.getCurrentNavigation()?.extras.state

  }
  ngOnInit(): void {
    let userData:User | any;
    const encryptedUserData = localStorage.getItem("encryptedUserData");
    if (encryptedUserData) {
      const userEnc = atob(encryptedUserData!);
      userData = JSON.parse(userEnc!);
    }
      if (userData) {
        this.afs.collection('users').doc(userData.uid).get().subscribe(
          (data: any) => {
            this.user = data.data();
            console.log('User data fetched:', this.user);
            this.afs.collection('ROOMS', ref => 
              ref.where('users', 'array-contains', this.user.uid) // Query for rooms with the current user
            ).get().subscribe(roomSnapshot => {
              let matchedRoom:any = null;
            
              // Manually filter the rooms to check if both users are present
              roomSnapshot.docs.forEach(doc => {
                const roomData:any = doc.data();
                if (roomData.users.includes(this.state.uid)) {
                  matchedRoom = roomData; // If the receiver is also in the room, store the room
                }
              });
            
              if (!matchedRoom) {
                // If no room exists with both users, create a new one
                const newRoomId = this.afs.createId(); // Generate a new room ID
                const newRoom = {
                  users: [this.user.uid, this.state.uid],  // Add both users
                  roomId: newRoomId,
                  createdAt: new Date()
                };
            
                // Create the new room in Firestore
                this.afs.collection('ROOMS').doc(newRoomId).set(newRoom).then(() => {
                  this.roomId = newRoomId;
                  this.fetchMessages(); // Fetch messages for the newly created room
                });
              } else {
                // If a room is found with both users, use that room ID
                this.roomId = matchedRoom.roomId;
                this.fetchMessages(); // Fetch messages for the existing room
              }
            }, (error) => {
              console.error('Error fetching room data:', error);
            })})
     
            
      } else {
        console.log('No user logged in.');
      }
   
  }
  fetchMessages(): void {
    this.messagesSubscription = this.afs.collection('ROOMS').doc(this.roomId).collection('messages', ref => ref.orderBy('date')).valueChanges().subscribe((messages: any[]) => {
      this.messages = messages;
    });
  }
    messages:Message[] = []

  // Bind this to the message input field
  messageText: string = '';

  sendMessage(): void {
    if (this.messageText.trim()) {
      // Create a message object
      let message: Message = {
        message: this.messageText,
        date: new Date(),
        roomId: this.roomId,
        uid: this.user.uid
      };
    
  
      if(this.roomId){
        this.sendChatMessage(message);
      }
    }
  
    // Clear the input field after sending the message
    this.messageText = '';
  }
  
  // Helper method to send the chat message to the specific room
  sendChatMessage(message: Message): void {
    this.afs.collection('ROOMS').doc(message.roomId).collection('messages').add({
      message: message.message,
      date: message.date,
      uid: message.uid
    }).then(() => {
      console.log('Message sent successfully');
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  }
  
}