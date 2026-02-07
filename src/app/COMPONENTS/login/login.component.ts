import { Component } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../SERVICES/auth.service';
import { User } from '../../SERVICES/model';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    TextFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatCommonModule,
    RouterModule
  ],

})
export class LoginComponent {
  public password: any;
  public email: any;
  private readonly userDataKey = "encryptedUserData";

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  async onLogin(email: string, password: string) {
    try {
      const user = (await this.authService.SignIn(email, password))
      if (user) {
        console.log(user)
        const encryptedUserData = btoa(JSON.stringify(user));
        localStorage.setItem(this.userDataKey, encryptedUserData);
        this.router.navigate(['home'])

      } else {
        console.error("Invalid user object:", user);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async ngOnInit(): Promise<void> {
    if (await this.authService.isLoggedIn()) {
      const encryptedUserData = localStorage.getItem("encryptedUserData");
      if (encryptedUserData) {
        const userEnc = atob(encryptedUserData!);
        const userData: User = JSON.parse(userEnc!);
        this.router.navigate(['home']);
      }
    }

  }

}