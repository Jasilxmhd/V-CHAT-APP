import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../SERVICES/model';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private router:Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    if (group.get('password')?.value !== group.get('confirmPassword')?.value) {
      return { mismatch: true };
    }
    return null;
  }

  async onRegister() {
    if (this.registerForm.valid) {
      const { name, email, password, role, gender } = this.registerForm.value;
      try {
        const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
        
        const userData: User = {
          uid: result.user?.uid || '',
          name,
          email,
          emailVerified: result.user?.emailVerified || false,
          gender
        };

        await this.firestore.collection('users').doc(result.user?.uid).set(userData);
        
        this.snackBar.open('Registration Successful', 'Close', { duration: 3000 });
        this.router.navigate(['/login'])
      } catch (error: any) {
        this.snackBar.open(`Error: ${error.message}`, 'Close', { duration: 5000 });
      }
    } else {
      this.snackBar.open('Please fill out the form correctly', 'Close', { duration: 3000 });
    }
  }
}
