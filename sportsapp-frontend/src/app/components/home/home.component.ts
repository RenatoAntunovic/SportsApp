import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SportService } from '../../services/sport.service';
import { LeagueService } from '../../services/league.service';
import { MatchService } from '../../services/match.service';
import { StandingService } from '../../services/standing.service';
import { Sport } from '../../models/sport.model';
import { League } from '../../models/league.model';
import { Match } from '../../models/match.model';
import { Standing } from '../../models/standing.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  sports: Sport[] = [];
  leagues: League[] = [];
  matches: Match[] = [];
  standings: Standing[] = [];

  selectedSportId: number | null = null;
  selectedLeagueId: number | null = null;
  activeTab: 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED' = 'ALL';

  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sportService: SportService,
    private leagueService: LeagueService,
    private matchService: MatchService,
    private standingService: StandingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUser();
    this.loadSports();
    this.loadLeagues();
    this.loadMatches();
  }

  loadUser() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userEmail = payload.sub || '';
      } catch (e) {
        console.error(e);
      }
    }
  }

  loadSports() {
    this.sportService.getAll().subscribe({
      next: (data) => {
        this.sports = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadLeagues() {
    this.leagueService.getAll().subscribe({
      next: (data) => {
        this.leagues = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadMatches() {
    this.matchService.getAll().subscribe({
      next: (data) => {
        this.matches = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadStandings() {
    if (!this.selectedLeagueId) {
      this.standings = [];
      return;
    }
    this.standingService.getByLeague(this.selectedLeagueId).subscribe({
      next: (data) => {
        this.standings = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  onSportChange() {
    this.selectedLeagueId = null;
    this.standings = [];
  }

  onLeagueChange() {
    this.loadStandings();
  }

  get filteredLeagues(): League[] {
    if (!this.selectedSportId) return this.leagues;
    return this.leagues.filter(l => l.sport?.id === this.selectedSportId);
  }

  get filteredMatches(): Match[] {
    let result = this.matches;

    // Filter po sportu
    if (this.selectedSportId) {
      result = result.filter(m => m.league?.sport?.id === this.selectedSportId);
    }

    // Filter po ligi
    if (this.selectedLeagueId) {
      result = result.filter(m => m.league?.id === this.selectedLeagueId);
    }

    // Filter po tabu
    if (this.activeTab !== 'ALL') {
      result = result.filter(m => m.status === this.activeTab);
    }

    return result;
  }

  setTab(tab: 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED') {
    this.activeTab = tab;
  }

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  getGoalDifference(s: Standing): number {
    return s.goalsFor - s.goalsAgainst;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 