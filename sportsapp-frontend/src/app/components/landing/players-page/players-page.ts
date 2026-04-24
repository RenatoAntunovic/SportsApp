import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { PlayerService } from '../../../services/player.service';
import { TeamService } from '../../../services/team.service';
import { SportService } from '../../../services/sport.service';
import { LeagueService } from '../../../services/league.service';
import { Player } from '../../../models/player.model';
import { Team } from '../../../models/team.model';
import { Sport } from '../../../models/sport.model';
import { League } from '../../../models/league.model';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './players-page.html',
  styleUrl: './players-page.css'
})
export class PlayersPage implements OnInit {
  players: Player[] = [];
  teams: Team[] = [];
  sports: Sport[] = [];
  leagues: League[] = [];

  selectedSportId: number | null = null;
  selectedLeagueId: number | null = null;
  selectedTeamId: number | null = null;

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private sportService: SportService,
    private leagueService: LeagueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPlayers();
    this.loadTeams();
    this.loadSports();
    this.loadLeagues();
  }

  loadPlayers() {
    this.playerService.getAll().subscribe({
      next: (data) => {
        this.players = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadTeams() {
    this.teamService.getAll().subscribe({
      next: (data) => this.teams = [...data]
    });
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
    this.selectedTeamId = null;
  }

  onLeagueChange() {
    this.selectedTeamId = null;
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
    return result;
  }

  get filteredPlayers(): Player[] {
    let result = this.players;
    if (this.selectedSportId) {
      result = result.filter(p => p.team?.sport?.id === this.selectedSportId);
    }
    if (this.selectedLeagueId) {
      result = result.filter(p => p.team?.league?.id === this.selectedLeagueId);
    }
    if (this.selectedTeamId) {
      result = result.filter(p => p.team?.id === this.selectedTeamId);
    }
    return result;
  }

  getPlayerInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}