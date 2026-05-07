import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatchService } from '../../../services/match.service';
import { SportService } from '../../../services/sport.service';
import { LeagueService } from '../../../services/league.service';
import { Match } from '../../../models/match.model';
import { Sport } from '../../../models/sport.model';
import { League } from '../../../models/league.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer, RouterLink],
  templateUrl: './matches-page.html',
  styleUrl: './matches-page.css'
})
export class MatchesPage implements OnInit {
  matches: Match[] = [];
  sports: Sport[] = [];
  leagues: League[] = [];

  selectedDate: string = '';
  selectedSportId: number | null = null;
  selectedLeagueId: number | null = null;
  activeTab: 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED' = 'ALL';

  constructor(
    private matchService: MatchService,
    private sportService: SportService,
    private leagueService: LeagueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMatches();
    this.loadSports();
    this.loadLeagues();
  }

  loadMatches() {
    this.matchService.getAll().subscribe({
      next: (data) => {
        this.matches = [...data];
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

 get filteredMatches(): Match[] {
  let result = this.matches;

  if (this.selectedSportId) {
    result = result.filter(m => m.league?.sport?.id === this.selectedSportId);
  }
  if (this.selectedLeagueId) {
    result = result.filter(m => m.league?.id === this.selectedLeagueId);
  }
  if (this.activeTab !== 'ALL') {
    result = result.filter(m => m.status === this.activeTab);
  }
  
  // Filter po datumu
  if (this.selectedDate) {
    result = result.filter(m => {
      if (!m.matchDate) return false;
      return m.matchDate.startsWith(this.selectedDate);
    });
  }

  return result;
}

clearDate() {
  this.selectedDate = '';
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
}