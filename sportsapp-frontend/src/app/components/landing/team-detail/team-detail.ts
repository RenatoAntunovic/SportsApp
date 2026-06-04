import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { TeamService } from '../../../services/team.service';
import { PlayerService } from '../../../services/player.service';
import { MatchService } from '../../../services/match.service';
import { Team } from '../../../models/team.model';
import { Player } from '../../../models/player.model';
import { Match } from '../../../models/match.model';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, Navbar, Footer,RouterLink],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css'
})
export class TeamDetail implements OnInit {
  team: Team | null = null;
  players: Player[] = [];
  matches: Match[] = [];
  activeTab: 'ROSTER' | 'MATCHES' | 'FORM' = 'ROSTER';

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe (params=>{
      const id = Number(params['id']);
    if (id) {
      this.team = null;
      this.players = [];
      this.matches=[];
      this.loadTeam(id);
      this.loadPlayers(id);
      this.loadMatches(id);
    }
  });
  }

  loadTeam(id: number) {
    this.teamService.getById(id).subscribe({
      next: (data) => {
        this.team = data;
        this.cdr.detectChanges();
      }
    });
  }

  loadPlayers(teamId: number) {
    // Dohvati sve igrače i filtriraj po timu
    this.playerService.getAll().subscribe({
      next: (data) => {
        this.players = data.filter(p => p.team?.id === teamId);
        this.cdr.detectChanges();
      }
    });
  }

  loadMatches(teamId: number) {
    this.matchService.getByTeam(teamId).subscribe({
      next: (data) => {
        this.matches = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'ROSTER' | 'MATCHES' | 'FORM') {
    this.activeTab = tab;
  }

  // Vraća unique pozicije iz igrača (npr. Golman, Odbrana...)
  get positionGroups(): string[] {
    const positions = this.players
      .map(p => p.position)
      .filter((p): p is string => !!p);
    return [...new Set(positions)];
  }

  // Vraća igrače koji imaju datu poziciju
  getPlayersByPosition(position: string): Player[] {
    return this.players.filter(p => p.position === position);
  }

  // Statistike tima
  get totalPlayers(): number {
    return this.players.length;
  }

  get wins(): number {
    if (!this.team) return 0;
    return this.matches.filter(m => {
      if (m.status !== 'FINISHED') return false;
      if (m.homeTeam?.id === this.team!.id) return m.homeScore > m.awayScore;
      return m.awayScore > m.homeScore;
    }).length;
  }

  get losses(): number {
    if (!this.team) return 0;
    return this.matches.filter(m => {
      if (m.status !== 'FINISHED') return false;
      if (m.homeTeam?.id === this.team!.id) return m.homeScore < m.awayScore;
      return m.awayScore < m.homeScore;
    }).length;
  }

  get draws(): number {
    return this.matches.filter(m => 
      m.status === 'FINISHED' && m.homeScore === m.awayScore
    ).length;
  }

  // Zadnjih 5 završenih mečeva za Formu tab
  get last5Matches(): { result: 'W' | 'D' | 'L', match: Match }[] {
    if (!this.team) return [];
    
    return this.matches
      .filter(m => m.status === 'FINISHED')
      .slice(-5)
      .reverse()
      .map(m => {
        let result: 'W' | 'D' | 'L' = 'D';
        if (m.homeScore === m.awayScore) {
          result = 'D';
        } else if (m.homeTeam?.id === this.team!.id) {
          result = m.homeScore > m.awayScore ? 'W' : 'L';
        } else {
          result = m.awayScore > m.homeScore ? 'W' : 'L';
        }
        return { result, match: m };
      });
  }

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  getPlayerInitials(name: string | undefined): string {
    return this.getTeamInitials(name);
  }
}