import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeamService } from '../../../services/team.service';
import { LeagueService } from '../../../services/league.service';
import { PlayerService } from '../../../services/player.service';
import { Team } from '../../../models/team.model';
import { League } from '../../../models/league.model';
import { Player } from '../../../models/player.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  userEmail = '';
  isAdmin = false;

  // Search
  searchQuery = '';
  showResults = false;
  allTeams: Team[] = [];
  allLeagues: League[] = [];
  allPlayers: Player[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private teamService: TeamService,
    private leagueService: LeagueService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadSearchData();
  }

  checkAuth() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.userEmail = payload.sub || '';
          this.isAdmin = payload.role === 'ADMIN';
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  loadSearchData() {
    this.teamService.getAll().subscribe({
      next: (data) => this.allTeams = data
    });
    this.leagueService.getAll().subscribe({
      next: (data) => this.allLeagues = data
    });
    this.playerService.getAll().subscribe({
      next: (data) => this.allPlayers = data
    });
  }

  onSearchFocus() {
    if (this.searchQuery.length > 0) {
      this.showResults = true;
    }
  }
  onSearchInput() {
    this.showResults = this.searchQuery.length > 0;
  }
  onSearchBlur() {
    setTimeout(() => this.showResults = false, 200);
  }
  get filteredTeams(): Team[] {
    if (!this.searchQuery) return [];
    const q = this.searchQuery.toLowerCase();
    return this.allTeams
      .filter(t => t.name.toLowerCase().includes(q))
      .slice(0, 5);
  }

  get filteredLeagues(): League[] {
    if (!this.searchQuery) return [];
    const q = this.searchQuery.toLowerCase();
    return this.allLeagues
      .filter(l => l.name.toLowerCase().includes(q))
      .slice(0, 5);
  }

  get filteredPlayers(): Player[] {
    if (!this.searchQuery) return [];
    const q = this.searchQuery.toLowerCase();
    return this.allPlayers
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 5);
  }

  get hasResults(): boolean {
    return this.filteredTeams.length > 0 || this.filteredLeagues.length > 0 || this.filteredPlayers.length > 0;
  }

  selectResult() {
    this.searchQuery = '';
    this.showResults = false;
  }

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}