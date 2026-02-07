import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../SERVICES/model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any;
  profilePic!: string;
  file!: File;
  userData: User | any;

  constructor(
    private afs: AngularFirestore,  // Firestore service
    private auth:AngularFireAuth,
    public dialogRef: MatDialogRef<ProfileComponent>, // To close the dialog
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data passed to the dialog
  ) { 
    this.auth.currentUser.then(user => {
      if (user) {
        this.user = user;
        console.log(user.displayName)
        console.log('Current user:', this.user);
      } else {
        console.log('No user is logged in');
      }
    }).catch(error => {
      console.error('Error fetching user data:', error);
    })

        const encryptedUserData = localStorage.getItem("encryptedUserData");
        if (encryptedUserData) {
          const userEnc = atob(encryptedUserData!);
          this.userData = JSON.parse(userEnc!);
        }

        console.log(this.userData)
  }


  ngOnInit() {
    const userData = { uid: 'user-uid' }; // Replace with actual user UID logic
    this.afs.collection('users').doc(userData.uid).get().subscribe(
      (data: any) => {
        this.user = data.data();
        console.log('User data fetched:', this.user);
        // If the user has a profile image URL, display it
        this.profilePic = this.user.profilePic;
      }
    );
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.convertFileToBase64(this.file).then((base64: string) => {
        // Save base64 string in Firestore
        this.profilePic = base64;
        const userData = { profilePic: base64 };

        // Replace 'user-uid' with the actual user UID
        this.afs.collection('users').doc(this.userData.uid).update(userData).then(() => {
          console.log('Profile picture updated in Firestore');
        }).catch(error => {
          console.error('Error updating profile picture:', error);
        });
      }).catch(error => {
        console.error('Error converting file to base64:', error);
      });
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Define the onload event to resolve the promise with the base64 data
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        resolve(base64String);
      };

      // Define the onerror event to reject the promise in case of error
      reader.onerror = (error) => {
        reject(error);
      };

      // Read the file as a base64 string
      reader.readAsDataURL(file);
    });
  }
}
