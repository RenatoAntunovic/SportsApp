import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { LeagueService } from '../../../services/league.service';
import { MatchService } from '../../../services/match.service';
import { StandingService } from '../../../services/standing.service';
import { League } from '../../../models/league.model';
import { Match } from '../../../models/match.model';
import { Standing } from '../../../models/standing.model';

@Component({
  selector: 'app-league-detail',
  standalone: true,
  imports: [CommonModule, Navbar, Footer,RouterLink],
  templateUrl: './league-detail.html',
  styleUrl: './league-detail.css'
})
export class LeagueDetail implements OnInit {
  league: League | null = null;
  standings: Standing[] = [];
  matches: Match[] = [];
  activeTab: 'STANDINGS' | 'MATCHES' = 'STANDINGS';

  constructor(
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private matchService: MatchService,
    private standingService: StandingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // ActivatedRoute nam daje parametar ':id' iz URL-a
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadLeague(id);
      this.loadStandings(id);
      this.loadMatches(id);
    }
  }

  loadLeague(id: number) {
    this.leagueService.getById(id).subscribe({
      next: (data) => {
        this.league = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load league error:', err)
    });
  }

  loadStandings(leagueId: number) {
    this.standingService.getByLeague(leagueId).subscribe({
      next: (data) => {
        this.standings = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadMatches(leagueId: number) {
    this.matchService.getByLeague(leagueId).subscribe({
      next: (data) => {
        this.matches = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'STANDINGS' | 'MATCHES') {
    this.activeTab = tab;
  }

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
  
  get isBasketball(): boolean {
  return this.league?.sport?.type === 'BASKETBALL';
}

get scoreLabels() {
  // PA/PF za košarku, GA/GF za ostalo
  return this.isBasketball 
    ? { for: 'PF', against: 'PA', diff: 'PD' }
    : { for: 'GF', against: 'GA', diff: 'GD' };
}

getScoreDifference(s: Standing): number {
  return s.goalsFor - s.goalsAgainst;
}

// Win percentage za košarku
getWinPercentage(s: Standing): string {
  if (s.played === 0) return '.000';
  const pct = s.won/s.played;
  if(pct === 1)
    return '1.000';
  return pct.toFixed(3).substring(1); 
}

get isFootball(): boolean{
  return this.league?.sport?.type === 'FOOTBALL';
}
}