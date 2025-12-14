import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
    },
    {
        path: 'login',
        loadComponent: () => import('./page/auth-page/auth-page').then(c => c.AuthPage)
    },
    {
        path: 'list',
        loadComponent: () => import('./page/project-list-page/project-list-page').then(c => c.ProjectListPage)
    },
    {
        path: 'project/:projectUuid',
        loadComponent: () => import('./page/project-detail-page/project-detail-page').then(c => c.ProjectDetailPage)
    },
    {
        path: 'profile',
        loadComponent: () => import('./page/user-profile-page/user-profile-page').then(c => c.UserProfilePage)
    },
    {
        path: 'contact',
        loadComponent: () => import('./page/contact-page/contact-page').then(c => c.ContactPage)
    }
];
