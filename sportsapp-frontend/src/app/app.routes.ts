import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard-guard';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { AdminSports } from './components/admin/admin-sports/admin-sports';
import { AdminLeagues } from './components/admin/admin-leagues/admin-leagues';
import { AdminTeams } from './components/admin/admin-teams/admin-teams';
import { AdminPlayers } from './components/admin/admin-players/admin-players';
import { AdminMatches } from './components/admin/admin-matches/admin-matches';
import { AdminStandings } from './components/admin/admin-standings/admin-standings';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },           // landing je početna
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
      path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'sports', pathMatch: 'full' },
      { path: 'sports', component: AdminSports },
      { path: 'leagues', component: AdminLeagues },
      { path: 'teams', component: AdminTeams },
      { path: 'players', component: AdminPlayers },
      { path: 'matches', component: AdminMatches },
      { path: 'standings', component: AdminStandings },
    ]
  }
];
