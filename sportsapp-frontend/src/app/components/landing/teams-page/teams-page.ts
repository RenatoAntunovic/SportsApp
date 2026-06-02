import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { TeamService } from '../../../services/team.service';
import { SportService } from '../../../services/sport.service';
import { LeagueService } from '../../../services/league.service';
import { Team } from '../../../models/team.model';
import { Sport } from '../../../models/sport.model';
import { League } from '../../../models/league.model';
import { AuthService } from '../../../services/auth.service';
import { FavoriteService } from '../../../services/favorite.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer, RouterLink],
  templateUrl: './teams-page.html',
  styleUrl: './teams-page.css'
})
export class TeamsPage implements OnInit {
  teams: Team[] = [];
  sports: Sport[] = [];
  leagues: League[] = [];
  
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  loadingMore = false;

  favoriteTeamsId : Set<number> = new Set();

  selectedSportId: number | null = null;
  selectedLeagueId: number | null = null;

  showOnlyFavorites = false;

  constructor(
    private teamService: TeamService,
    private sportService: SportService,
    private leagueService: LeagueService,
    private cdr: ChangeDetectorRef,
    public authService : AuthService,
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private router : Router
  ) {}

  ngOnInit() {
    this.loadTeams();
    this.loadSports();
    this.loadLeagues();
    if(this.authService.isLoggedIn()){
      this.loadFavorites();
    }
  }
  loadFavorites() {
    this.favoriteService.getFavoriteTeams().subscribe({
      next: (data) => {
        this.favoriteTeamsId = new Set(data.map(l => l.id!));
        this.cdr.detectChanges();
      }
    })
  }

  get hasMore(): boolean {
  return this.currentPage < this.totalPages - 1;
}

  isFavorite(teamId:number):boolean{
    return this.favoriteTeamsId.has(teamId);
  }

  toggleFavorite(event: Event, teamId: number) {
  event.stopPropagation();
  event.preventDefault();

  if (!this.authService.isLoggedIn()) {
    this.toastService.info('Prijavi se da bi dodao tim u favorite');
    this.router.navigate(['/login']);
    return;
  }

  const wasAlreadyFavorite = this.favoriteTeamsId.has(teamId);

  this.favoriteService.toggleTeamFavorite(teamId).subscribe({
    next: () => {
      if (wasAlreadyFavorite) {
        this.favoriteTeamsId.delete(teamId);
        this.toastService.info('Tim uklonjen iz favorita');
      } else {
        this.favoriteTeamsId.add(teamId);
        this.toastService.success('Tim dodan u favorite');
      }
      this.cdr.detectChanges();
    },
    error: () => this.toastService.error('Greška pri ažuriranju favorita')
  });
}

  loadTeams() {
  this.teamService.getAllPaged(this.currentPage, this.pageSize).subscribe({
    next: (data) => {
      this.teams = [...this.teams, ...data.content];
      this.totalPages = data.totalPages;
      this.loadingMore = false;
      this.cdr.detectChanges();
    }
  });
}

loadMore() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadingMore = true;
    this.loadTeams();
  }
}

  loadSports() {
    this.sportService.getAll().subscribe({
      next: (data) => this.sports = [...data]
    });
  }

  loadLeagues() {
    this.leagueService.getAll().subscribe({
      next: (data) => this.leagues = [...data]
    });
  }

  onSportChange() {
    this.selectedLeagueId = null;
  }

  get filteredLeagues(): League[] {
    if (!this.selectedSportId) return this.leagues;
    return this.leagues.filter(l => l.sport?.id === this.selectedSportId);
  }

 get filteredTeams(): Team[] {
  let result = this.teams;
  if (this.selectedSportId) {
    result = result.filter(t => t.sport?.id === this.selectedSportId);
  }
  if (this.selectedLeagueId) {
    result = result.filter(t => t.league?.id === this.selectedLeagueId);
  }
  if (this.showOnlyFavorites) {
    result = result.filter(t => this.favoriteTeamsId.has(t.id!));
  }
  return result;
}

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}