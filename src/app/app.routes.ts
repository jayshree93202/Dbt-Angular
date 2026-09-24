import { Routes } from '@angular/router';

import { Dashboard } from './features/dadm/dashboard/dashboard';
import { AboutUs } from './features/public/about-us/about-us';
import { CumulativeReport } from './features/sadm/cumulative-report/cumulative-report';
import { SchemeList } from './features/public/scheme-list/scheme-list';
import { Beneficiaries } from './features/users/user-list/beneficiaries';
import { Departments } from './features/state-data/state-data-list/departments';
import { Search } from './features/helpdesk/search/search';
import { ChangePassword } from './features/sadm/change-password/change-password';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'about',
    component: AboutUs
  },
  {
    path: 'reports',
    component: CumulativeReport
  },
  {
    path: 'schemes',
    component: SchemeList
  },
  {
    path: 'beneficiaries',
    component: Beneficiaries
  },
  {
    path: 'departments',
    component: Departments
  },
  {
    path: 'grievance',
    component: Search
  },
  {
    path: 'settings',
    component: ChangePassword
  },

  {
  path: 'reports/department-wise',
  loadComponent: () =>
    import('./reports/cumulative-details-report/cumulative-details-report')
      .then(m => m.CumulativeDetailsReportComponent)
},
{
  path: 'reports/department-list',
  loadComponent: () =>
    import('./reports/department-list/department-list')
      .then(m => m.DepartmentListComponent)
},
{
  path: 'reports/scheme-wise',
  loadComponent: () =>
    import('./reports/department-wise-scheme-list/department-wise-scheme-list')
      .then(m => m.DepartmentWiseSchemeListComponent)
},
{
    path: 'reports/beneficiary',
    loadComponent: () =>
      import('./reports/department-cssandstate-scheme-list/department-cssandstate-scheme-list')
        .then(m => m.DepartmentCssandstateSchemeListComponent)
  },
  {
    path: 'reports/fund-transfer',
    loadComponent: () =>
    import('./reports/last-update-scheme-list/last-update-scheme-list')
      .then(m => m.LastUpdateSchemeListComponent)
      // ,canActivate: [authGuard]
  },
   {
    path: 'login',
    component: LoginComponent
  },



];