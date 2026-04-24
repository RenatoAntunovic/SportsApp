import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { TeamService } from '../../../services/team.service';
import { SportService } from '../../../services/sport.service';
import { LeagueService } from '../../../services/league.service';
import { Team } from '../../../models/team.model';
import { Sport } from '../../../models/sport.model';
import { League } from '../../../models/league.model';

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

  selectedSportId: number | null = null;
  selectedLeagueId: number | null = null;

  constructor(
    private teamService: TeamService,
    private sportService: SportService,
    private leagueService: LeagueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTeams();
    this.loadSports();
    this.loadLeagues();
  }

  loadTeams() {
    this.teamService.getAll().subscribe({
      next: (data) => {
        this.teams = [...data];
        this.cdr.detectChanges();
      }
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

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}