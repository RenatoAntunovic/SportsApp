import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { League } from '../../../models/league.model';
import { Standing } from '../../../models/standing.model';
import { LeagueService } from '../../../services/league.service';
import { StandingService } from '../../../services/standing.service';

@Component({
  selector: 'app-admin-standings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-standings.html',
  styleUrl: './admin-standings.css'
})
export class AdminStandings implements OnInit {
  leagues: League[] = [];
  standings: Standing[] = [];
  selectedLeagueId: number | null = null;

  constructor(
    private leagueService: LeagueService,
    private standingService: StandingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLeagues();
  }

  loadLeagues() {
    this.leagueService.getAll().subscribe({
      next: (data) => {
        this.leagues = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load leagues error:', err)
    });
  }

  onLeagueChange() {
    if (!this.selectedLeagueId) {
      this.standings = [];
      return;
    }
    this.loadStandings();
  }

  loadStandings() {
    if (!this.selectedLeagueId) return;
    this.standingService.getByLeague(this.selectedLeagueId).subscribe({
      next: (data) => {
        this.standings = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load standings error:', err)
    });
  }

  getGoalDifference(s: Standing): number {
    return s.goalsFor - s.goalsAgainst;
  }
}