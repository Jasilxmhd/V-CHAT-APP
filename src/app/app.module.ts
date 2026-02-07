import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { LoginComponent } from './COMPONENTS/login/login.component';
import { DashboardComponent } from './COMPONENTS/dashboard/dashboard.component';
import { AuthService } from './SERVICES/auth.service';
import { AuthGuard } from './SERVICES/auth.guard';
import { RegisterComponent } from './COMPONENTS/register/register.component';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatCommonModule, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RegisterComponent,
    ChatPageComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Angular Material modules
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatStepperModule,
    MatSortModule,
    MatAutocompleteModule,
    TextFieldModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatChipsModule,
  ],

  bootstrap: [AppComponent],

  providers: [
     provideFirebaseApp(() => initializeApp({"projectId":"v-chat-com","appId":"1:1086397499328:web:9a77374f64cc067c8b2a25","storageBucket":"v-chat-com.firebasestorage.app","apiKey":"AIzaSyDKtDYsz0cKF-hic_d-Iz1J0rotGfCqsnI","authDomain":"v-chat-com.firebaseapp.com","messagingSenderId":"1086397499328","measurementId":"G-YPFNB9WX8D"})),
     provideAuth(() => getAuth()),
     provideFirestore(() => getFirestore()),
     {provide:FIREBASE_OPTIONS, useValue:{"projectId":"v-chat-com","appId":"1:1086397499328:web:9a77374f64cc067c8b2a25","storageBucket":"v-chat-com.firebasestorage.app","apiKey":"AIzaSyDKtDYsz0cKF-hic_d-Iz1J0rotGfCqsnI","authDomain":"v-chat-com.firebaseapp.com","messagingSenderId":"1086397499328","measurementId":"G-YPFNB9WX8D"}}

  ]
})
export class AppModule { }
