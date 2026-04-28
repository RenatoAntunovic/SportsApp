import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard-guard';
import { LandingComponent } from './components/landing/landing';
import { MatchesPage } from './components/landing/matches-page/matches-page';
import { LeaguesPage } from './components/landing/leagues-page/leagues-page';
import { TeamsPage } from './components/landing/teams-page/teams-page';
import { PlayersPage } from './components/landing/players-page/players-page';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { AdminSports } from './components/admin/admin-sports/admin-sports';
import { AdminLeagues } from './components/admin/admin-leagues/admin-leagues';
import { AdminTeams } from './components/admin/admin-teams/admin-teams';
import { AdminPlayers } from './components/admin/admin-players/admin-players';
import { AdminMatches } from './components/admin/admin-matches/admin-matches';
import { AdminStandings } from './components/admin/admin-standings/admin-standings';
import { adminGuard } from './guards/admin-guard';
import { landingGuard } from './guards/landing/landing-guard';
import { LeagueDetail } from './components/landing/league-detail/league-detail';
import { TeamDetail } from './components/landing/team-detail/team-detail';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [landingGuard] },
  { path: 'login', component: LoginComponent, canActivate: [landingGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [landingGuard] },
  { path: 'matches', component: MatchesPage },
  { path: 'leagues', component: LeaguesPage },
  { path: 'teams', component: TeamsPage },
  { path: 'leagues/:id',component : LeagueDetail},
  { path: 'players', component: PlayersPage },
  {path: 'teams/:id',component :  TeamDetail},
  {path: 'profile', component: Profile ,canActivate: [authGuard]},
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