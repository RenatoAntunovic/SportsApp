import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MatchService } from '../../../services/match.service';
import { PlayerService } from '../../../services/player.service';
import { Match } from '../../../models/match.model';
import { Player } from '../../../models/player.model';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar, Footer],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.css'
})
export class MatchDetail implements OnInit {
  match: Match | null = null;
  allMatches: Match[] = [];
  homeTeamPlayers: Player[] = [];
  awayTeamPlayers: Player[] = [];
  activeTab: 'OVERVIEW' | 'FORM' | 'SASTAVI' = 'OVERVIEW';

  private positionOrder: { [key: string]: string[] } = {
  'Fudbal': ['Golman', 'Odbrana', 'Vezni red', 'Napad'],
  'Košarka': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  'Hokej': ['Golman', 'Odbrana', 'Napad'],
  'Tenis': ['Igrač'],
  'Boks': ['Bokser'],
  'Odbojka': ['Tehničar', 'Primač', 'Korektor', 'Libero', 'Centar']
};

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMatch(id);
      this.loadAllMatches();
    }
  }

  loadMatch(id: number) {
    this.matchService.getById(id).subscribe({
      next: (data) => {
        this.match = data;
        this.cdr.detectChanges();
        if (data.homeTeam?.id) this.loadPlayers(data.homeTeam.id, 'home');
        if (data.awayTeam?.id) this.loadPlayers(data.awayTeam.id, 'away');
      }
    });
  }

  loadAllMatches() {
    this.matchService.getAll().subscribe({
      next: (data) => {
        this.allMatches = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadPlayers(teamId: number, side: 'home' | 'away') {
    this.playerService.getByTeam(teamId).subscribe({
      next: (data) => {
        if (side === 'home') this.homeTeamPlayers = [...data];
        else this.awayTeamPlayers = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'OVERVIEW' | 'FORM' | 'SASTAVI') {
    this.activeTab = tab;
  }

  
  get headToHead(): Match[] {
    if (!this.match || !this.match.homeTeam || !this.match.awayTeam) return [];
    const homeId = this.match.homeTeam.id;
    const awayId = this.match.awayTeam.id;
    return this.allMatches
      .filter(m => 
        m.id !== this.match!.id &&
        m.status === 'FINISHED' &&
        ((m.homeTeam?.id === homeId && m.awayTeam?.id === awayId) ||
         (m.homeTeam?.id === awayId && m.awayTeam?.id === homeId))
      )
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
      .slice(0, 5);
  }

  getTeamForm(teamId: number | undefined): ('W' | 'D' | 'L')[] {
    if (!teamId) return [];
    return this.allMatches
      .filter(m => 
        m.status === 'FINISHED' &&
        (m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
      )
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
      .slice(0, 5)
      .map(m => {
        const isHome = m.homeTeam?.id === teamId;
        const teamScore = isHome ? m.homeScore : m.awayScore;
        const oppScore = isHome ? m.awayScore : m.homeScore;
        if (teamScore > oppScore) return 'W';
        if (teamScore < oppScore) return 'L';
        return 'D';
      });
  }


  getPlayersByPosition(players: Player[]): { [key: string]: Player[] } {
    return players.reduce((acc, player) => {
      const pos = player.position || 'Ostalo';
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(player);
      return acc;
    }, {} as { [key: string]: Player[] });
  }

getPositionKeys(players: Player[]): string[] {
  const grouped = this.getPlayersByPosition(players);
  const sportName = this.match?.league?.sport?.name;
  const order = sportName ? this.positionOrder[sportName] : null;
  
  if (!order) return Object.keys(grouped);
  
  
  return Object.keys(grouped).sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
}

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }


  getH2HResult(m: Match, perspectiveTeamId: number): 'W' | 'D' | 'L' {
    const isHome = m.homeTeam?.id === perspectiveTeamId;
    const teamScore = isHome ? m.homeScore : m.awayScore;
    const oppScore = isHome ? m.awayScore : m.homeScore;
    if (teamScore > oppScore) return 'W';
    if (teamScore < oppScore) return 'L';
    return 'D';
  }
}