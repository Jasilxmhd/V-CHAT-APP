import { Component } from '@angular/core';
import { User } from './SERVICES/model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './SERVICES/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'V CHAT';
userData: User | undefined;


  constructor(private auth: AuthService,private afs: AngularFirestore,private dialog:MatDialog) {
    const encryptedUserData = localStorage.getItem("encryptedUserData");
    if (encryptedUserData) {
      const userEnc = atob(encryptedUserData!);
      this.userData = JSON.parse(userEnc!);
      console.log(this.userData)
    }
  }
  fnSignOut(){
    this.auth.SignOut()

  }
  fnProfile() {
    this.dialog.open(ProfileComponent, {
      width: '400px',  // You can customize the size of the dialog here
      data: { user: this.auth.getUserData }  // Pass any data to the dialog if needed
    });
  }

}
