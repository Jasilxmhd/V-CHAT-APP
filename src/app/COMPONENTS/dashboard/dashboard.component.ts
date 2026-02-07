import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../SERVICES/auth.service';
import { User } from '../../SERVICES/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userData: User | undefined;
  contacts!: Observable<any[]>;
  usersDataList: User[] = [];

  constructor(private auth: AuthService, private afs: AngularFirestore, private route: Router) {
    const encryptedUserData = localStorage.getItem("encryptedUserData");
    if (encryptedUserData) {
      const userEnc = atob(encryptedUserData!);
      this.userData = JSON.parse(userEnc!);
      console.log(this.userData)
    }
  }
  ngOnInit(): void {
    this.fetchContacts()
    this.getChatList()
  }
  fnSignOut() {
    this.auth.SignOut();
  }

  fetchContacts() {
    this.contacts = this.afs.collection('users').snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return data as any;
        })
      )
    );
    this.contacts.subscribe((data) => {
      console.log(data)

    })
  }
  fnChat(note: any) {
    const navigationExtras: NavigationExtras = {
      state: note

    }
    this.route.navigate(['chat'], navigationExtras)

  }

  getChatList() {
    let usersList: string[] = [];
  
    // First, fetch all rooms the user is part of
    this.afs.collection('ROOMS', ref =>
      ref.where('users', 'array-contains', this.userData!.uid) // Query for rooms with the current user
    ).get().subscribe(roomSnapshot => {
  
      // Iterate over each room document in the room snapshot
      roomSnapshot.docs.forEach(doc => {
        const roomData: any = doc.data();  // Extract room data
  
        // Check if the room has a users array
        if (roomData.users && roomData.users.length > 1) {
          // Iterate through the users array to find the other user(s)
          roomData.users.forEach((userId: string) => {
            if (userId !== this.userData!.uid) {  // If the user ID is not the current user's ID
              usersList.push(userId);  // Add the other user to the usersList
            }
          });
        }
      });
  
      // Once the usersList is populated, fetch user data for all user IDs
      // Use Promise.all to handle all user data fetches
      let userPromises = usersList.map(userId => 
        this.afs.collection('users').doc(userId).get().toPromise()
      );
  
      Promise.all(userPromises).then(userDocs => {
        // For each user document, check if it exists and store the data
        userDocs.forEach((userDoc:any) => {
          if (userDoc!.exists && userDoc?.data()) {
            this.usersDataList.push(userDoc?.data());  // Add user data to the usersDataList
          }
        });
  
        // Log or use the final usersDataList after all user data is fetched
        console.log(this.usersDataList);
      }).catch(error => {
        console.error('Error fetching user data:', error);
      });
  
    }, error => {
      console.error('Error fetching rooms data:', error);
    });
  }
}  