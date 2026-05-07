import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { League } from '../../../models/league.model';
import { Team } from '../../../models/team.model';
import { Match } from '../../../models/match.model';
import { LeagueService } from '../../../services/league.service';
import { TeamService } from '../../../services/team.service';
import { SportService } from '../../../services/sport.service';
import { Sport } from '../../../models/sport.model';
import { MatchService } from '../../../services/match.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-matches',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-matches.html',
  styleUrl: './admin-matches.css',
  standalone: true
})
export class AdminMatches implements OnInit {

  leagues: League[] = [];
  teams : Team[] = [];
  sports : Sport[] = [];
  matches : Match[] = [];
  showModal = false;

  editMode = false;
  editId : number | null = null;
  saving = false;

  filterSportId: number | null = null;
  filterLeagueId: number | null = null;
  filterStatus: string = 'ALL';
  selectedSportId : number | null = null;
  selectedHomeTeamId : number | null = null;
  selectedAwayTeamId  : number | null = null;
  selectedLeagueId : number | null = null;

  form: Match = {
    matchDate : '',
    homeScore : 0,
    awayScore : 0,
    status : 'SCHEDULED'
  };

  /**
   *
   */
  constructor( 
    private matchService : MatchService,
    private sportsService : SportService,
    private leagueService : LeagueService,
    private teamService : TeamService,
    private cdr : ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadTeams();
    this.loadSports();
    this.loadMatches();
    this.loadLeagues();
  }
  loadLeagues() {
    this.leagueService.getAll().subscribe({
      next:(data) => {
        this.leagues = [...data];
        this.cdr.detectChanges();
      },
      error:(err) => console.error('Load leagues error:',err)
    });
  }

  loadTeams() {
    this.teamService.getAll().subscribe({
      next:(data) => {
        this.teams = [...data];
        this.cdr.detectChanges();
      },
      error(err) {
        console.error('Load teams error: ',err);
      },
    })
  }
  loadSports() {
    this.sportsService.getAll().subscribe({
      next:(data) => {
        this.sports = [...data];
        this.cdr.detectChanges();
      },
      error(err) {
        console.error('Load sports error: ',err);
      },
    })
  }
  loadMatches() {
     this.matchService.getAll().subscribe({
      next:(data) => {
        this.matches = [...data];
        this.cdr.detectChanges();
      },
      error(err) {
        console.error('Load matches error: ',err);
      },
    })
  }

  openModal(match?: Match) {
    this.saving = false;
    if (match) {
     
      this.editMode = true;
      this.editId = match.id!;
      this.form = { ...match };   
      this.selectedSportId = match.league?.sport?.id ?? null;
      this.selectedHomeTeamId = match.homeTeam?.id ?? null;
      this.selectedAwayTeamId = match.awayTeam?.id ?? null;
      this.selectedLeagueId = match.league?.id ?? null;
    } else {
      this.editMode = false;
      this.editId = null;
      this.form = {  matchDate : '',
    homeScore : 0,
    awayScore : 0,
    status : 'SCHEDULED'};
      this.selectedSportId = null;
      this.selectedAwayTeamId = null;
      this.selectedHomeTeamId = null;
      this.selectedLeagueId = null;
    }
    this.showModal = true;
  }

  closeModal() {
    this.saving = false;
    this.showModal = false;
  }

 saveMatch() {
  if (this.saving) return;

  // Validacija obaveznih polja
  if (!this.selectedSportId) {
    alert('Odaberi sport!');
    return;
  }
  if (!this.selectedLeagueId) {
    alert('Odaberi ligu!');
    return;
  }
  if (!this.selectedHomeTeamId) {
    alert('Odaberi domaći tim!');
    return;
  }
  if (!this.selectedAwayTeamId) {
    alert('Odaberi gostujući tim!');
    return;
  }
  if (!this.form.matchDate) {
    alert('Unesi datum i vrijeme meča!');
    return;
  }
  if (!this.form.status) {
    alert('Odaberi status meča!');
    return;
  }

  
  if (this.form.status === 'SCHEDULED' || this.form.status === 'POSTPONED') {
    if (this.form.homeScore > 0 || this.form.awayScore > 0) {
      alert('Zakazan ili odgođen meč ne može imati rezultat!');
      return;
    }
  }

  if (this.form.status === 'FINISHED') {
    if (this.form.homeScore === null || this.form.awayScore === null) {
      alert('Završen meč mora imati rezultat!');
      return;
    }
  }
  if (this.form.status === 'LIVE') {
  const matchDate = new Date(this.form.matchDate);
  const now = new Date();
  
 
  if (matchDate > now) {
    alert('LIVE meč ne može biti zakazan za budućnost!');
    return;
  }
}

if (this.form.status === 'FINISHED') {
  const matchDate = new Date(this.form.matchDate);
  const now = new Date();
  
  if (matchDate > now) {
    alert('Završen meč ne može biti u budućnosti!');
    return;
  }
}
  if (this.form.status === 'SCHEDULED') {
    const matchDate = new Date(this.form.matchDate);
    if (matchDate < new Date()) {
      alert('Zakazan meč ne može biti u prošlosti!');
      return;
    }
  }

  this.saving = true;

  const selectedLeague = this.leagues.find(l => l.id === this.selectedLeagueId) || undefined;
  const selectedHomeTeam = this.teams.find(t => t.id === this.selectedHomeTeamId) || undefined;
  const selectedAwayTeam = this.teams.find(t => t.id === this.selectedAwayTeamId) || undefined;

  const matchToSave: Match = {
    ...this.form,
    league: selectedLeague,
    homeTeam: selectedHomeTeam,
    awayTeam: selectedAwayTeam
  };

  const request = this.editMode && this.editId
    ? this.matchService.update(this.editId, matchToSave)
    : this.matchService.create(matchToSave);

  request.subscribe({
    next: () => {
      this.saving = false;
      this.showModal = false;
      this.loadMatches();
    },
    error: (err) => {
      console.error('Save error:', err);
      this.saving = false;
    }
  });
}

  deleteMatch(id: number) {
    if (confirm('Jesi li siguran da želiš obrisati ovaj meč?')) {
      this.matchService.delete(id).subscribe({
        next: () => this.loadMatches(),
        error: () => alert('Ne možeš obrisati meč!')
      });
    }
  }

 get filteredLeagues(): League[] {
  if (!this.selectedSportId) 
    return this.leagues;
  return this.leagues.filter(l => l.sport?.id === this.selectedSportId);
}

get filteredHomeTeams(): Team[] {
  if (!this.selectedLeagueId) 
    return [];
  return this.teams.filter(t => t.league?.id === this.selectedLeagueId);
}

get filteredAwayTeams(): Team[] {
  if (!this.selectedLeagueId) return [];
  return this.teams.filter(t => 
    t.league?.id === this.selectedLeagueId && t.id !== this.selectedHomeTeamId
  );
}

get filteredMatches(): Match[] {
  let result = this.matches;

  if (this.filterSportId) {
    result = result.filter(m => m.league?.sport?.id === this.filterSportId);
  }
  if (this.filterLeagueId) {
    result = result.filter(m => m.league?.id === this.filterLeagueId);
  }
  if (this.filterStatus !== 'ALL') {
    result = result.filter(m => m.status === this.filterStatus);
  }
  return result;
}

get filterLeagues(): League[] {
  if (!this.filterSportId) return this.leagues;
  return this.leagues.filter(l => l.sport?.id === this.filterSportId);
}

onFilterSportChange() {
  this.filterLeagueId = null;
}
}
