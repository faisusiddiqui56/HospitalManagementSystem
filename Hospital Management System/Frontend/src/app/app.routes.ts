import { Routes } from '@angular/router';
import { AppointMents } from './appoint-ments/appoint-ments';
import { Dashboard } from './dashboard/dashboard';
import { CompletedAppointMents } from './completed-appoint-ments/completed-appoint-ments';
import { Doctor } from './doctor/doctor';
import { Patient } from './patient/patient';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './guards/auth.guard';
import { Profile } from './profile/profile';
import { MedicalStore } from './medical-store/medical-store';

// Public components
import { PublicLayoutComponent } from './public-layout/public-layout';
import { HomeComponent } from './home/home';
import { AboutComponent } from './about/about';
import { ServicesComponent } from './services/services';
import { ContactComponent } from './contact/contact';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'contact', component: ContactComponent }
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'dashboard',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: Dashboard
            },
            {
                path: 'AppointMents',
                component: AppointMents
            },
            {
                path: 'Completed',
                component: CompletedAppointMents
            },
            {
                path: 'Doctor',
                component: Doctor
            },
            {
                path: 'Patient',
                component: Patient
            },
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'MedicalStore',
                component: MedicalStore
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
