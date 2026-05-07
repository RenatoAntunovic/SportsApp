import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink ,RouterLinkActive} from '@angular/router';
import { SportService } from '../../services/sport.service';
import { MatchService } from '../../services/match.service';
import { LeagueService } from '../../services/league.service';
import { TeamService } from '../../services/team.service';
import { Sport } from '../../models/sport.model';
import { Match } from '../../models/match.model';
import { League } from '../../models/league.model';
import { Team } from '../../models/team.model';
import { Navbar } from '../shared/navbar/navbar';
import { Footer } from '../shared/footer/footer';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterLinkActive,Navbar,Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent implements OnInit {
  sports: Sport[] = [];
  leagues: League[] = [];
  teams: Team[] = [];
  matches: Match[] = [];

  favoriteTeams : Team[] = [];
  favoriteLeagues: League[] = [];
  sportsCount = 0;
  leaguesCount = 0;
  teamsCount = 0;
  matchesCount = 0;

  isLoggedIn = false;

  activeTab: 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED' = 'ALL';

  constructor(
    private sportService: SportService,
    private matchService: MatchService,
    private leagueService: LeagueService,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef,
    private authService : AuthService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadAll();
    if(this.isLoggedIn){
      this.loadFavorites();
    }
  }
   loadFavorites() {
    this.favoriteService.getFavoriteTeams().subscribe({
      next: (data) => {
        this.favoriteTeams = [...data];
        this.cdr.detectChanges();
      }
    });
    this.favoriteService.getFavoriteLeagues().subscribe({
      next: (data) => {
        this.favoriteLeagues = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadAll() {
    this.sportService.getAll().subscribe({
      next: (data) => {
        this.sports = [...data];
        this.sportsCount = data.length;
        this.cdr.detectChanges();
      }
    });

    this.leagueService.getAll().subscribe({
      next: (data) => {
        this.leagues = [...data];
        this.leaguesCount = data.length;
        this.cdr.detectChanges();
      }
    });

    this.teamService.getAll().subscribe({
      next: (data) => {
        this.teams = [...data];
        this.teamsCount = data.length;
        this.cdr.detectChanges();
      }
    });

    this.matchService.getAll().subscribe({
      next: (data) => {
        this.matches = [...data];
        this.matchesCount = data.length;
        this.cdr.detectChanges();
      }
    });
  }

  
  getLeagueCountForSport(sportId: number): number {
    return this.leagues.filter(l => l.sport?.id === sportId).length;
  }


  get featuredMatches(): Match[] {
    const live = this.matches.filter(m => m.status === 'LIVE');
    const finished = this.matches.filter(m => m.status === 'FINISHED');
    return [...live, ...finished].slice(0, 3);
  }

  
 get filteredMatches(): Match[] {
  let result = this.matches;
  
  if (this.activeTab !== 'ALL') {
    result = result.filter(m => m.status === this.activeTab);
  }
  result = [...result].sort((a, b) => { 
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;
    

    if (a.status === 'FINISHED' && b.status === 'SCHEDULED') return -1;
    if (a.status === 'SCHEDULED' && b.status === 'FINISHED') return 1;
    
    if (a.status === 'FINISHED') {
      return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
    }
    return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
  });
  

  return result.slice(0, 10);
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

  get favoriteTeamsMatches(): Match[] {
    if (this.favoriteTeams.length === 0) return [];
    const favoriteIds = new Set(this.favoriteTeams.map(t => t.id!));
    return this.matches.filter(m => 
      (m.homeTeam?.id && favoriteIds.has(m.homeTeam.id)) ||
      (m.awayTeam?.id && favoriteIds.has(m.awayTeam.id))
    ).slice(0, 5); 
  }
}