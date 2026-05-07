import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sport } from '../../../models/sport.model';
import { Team } from '../../../models/team.model';
import { League } from '../../../models/league.model';
import { Player } from '../../../models/player.model';
import { PlayerService } from '../../../services/player.service';
import { TeamService } from '../../../services/team.service';
import { LeagueService } from '../../../services/league.service';
import { SportService } from '../../../services/sport.service';

@Component({
  selector: 'app-admin-players',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-players.html',
  styleUrl: './admin-players.css',
  standalone :true
})
export class AdminPlayers implements OnInit{

  positionsMap: { [key: string]: string[] } = {
  'Fudbal': ['Golman', 'Odbrana', 'Vezni red', 'Napad'],
  'Košarka': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  'Hokej': ['Golman', 'Odbrana', 'Napad'],
  'Tenis': ['Igrač'],
  'Boks': ['Bokser'],
  'Odbojka': ['Tehničar', 'Primač', 'Korektor', 'Libero', 'Centar']
};

  leagues : League[] = [];
  sports : Sport[] = [];
  teams : Team[] = [];
  players : Player[] = [];

  showModal  = false;
  editMode = false;
  editId : number|null = null;
  saving = false;

  filterSportId: number |null = null;
  filterLeagueId: number | null = null;
  filterTeamId: number |null = null;
  selectedSportId : number | null = null;
  selectedTeamId : number|null = null;
  selectedLeagueId : number |null =null;
  form : Player = {name: '',position:'',age:0,nationality:'',photoUrl:''};
  ngOnInit(): void {
      this.loadTeams();
      this.loadPlayers();
      this.loadSports();
      this.loadLeagues();
  }
  loadLeagues() {
    this.leagueService.getAll().subscribe({
    next: (data) => {
      this.leagues = [...data];
      this.cdr.detectChanges();
    },
    error(err) {
      console.error('Load leagues error: ',err);
    },
  });
  }

  /**
   *
   */
 constructor(
  private playerService : PlayerService,
  private teamService : TeamService,
  private leagueService: LeagueService,
  private sportService : SportService,
  private cdr : ChangeDetectorRef
 ){}

  loadTeams() {
    this.teamService.getAll().subscribe({
      next: (data) =>{
        this.teams = [...data];
        this.cdr.detectChanges();
      },
      error(err){
        console.error("Load teams error: ",err);
      }
    })
  }
  loadPlayers() {
    this.playerService.getAll().subscribe({
      next: (data) =>{
        this.players = [...data];
        this.cdr.detectChanges();
      },
      error(err) {
        console.error("Load teams error: ",err);
      },
    })
  }
  loadSports() {
     this.sportService.getAll().subscribe({
      next : (data) => {
        this.sports = [...data];
        this.cdr.detectChanges();
      },
      error(err) {
        console.error("Load sports error: ", err);
      },
    })
  }

  openModal(player?:Player){
    this.saving = false;

    if(player){
      this.editMode = true;
      this.editId = player.id!;
      this.form = {...player};
      this.selectedLeagueId = player.team?.league?.id ?? null;
      this.selectedSportId = player.team?.sport?.id ?? null;
      this.selectedTeamId = player.team?.id ?? null;
    }else{
      this.editMode = false;
      this.editId = null;
      this.form = {name: '',position:'',age:0,nationality:'',photoUrl:''};
       this.selectedLeagueId = null;
      this.selectedSportId = null;
      this.selectedTeamId = null;
    }

    this.showModal = true;
  }

  closeModal(){
    this.saving = false;
    this.showModal = false;
  }

  savePlayer(){
    if(!this.form.name ||this.saving)
      return;

    this.saving = true;

    const selectedSport = this.sports.find(x => x.id === this.selectedSportId) || undefined;
    const selectedLeague = this.leagues.find(x => x.id === this.selectedLeagueId) || undefined;
    const selectedTeam = this.teams.find(x => x.id === this.selectedTeamId) ||undefined;

    const playerToSave : Player ={
      ...this.form,
      team : selectedTeam
    }

    const request = this.editMode && this.editId ? this.playerService.update(this.editId,playerToSave)
  :this.playerService.create(playerToSave);

  request.subscribe({
    next: () => {
      this.saving = false;
      this.showModal = false;
      this.loadPlayers();
    },
    error: (err) =>{
      console.error('Save error: ',err);
      this.saving = false;
    },
  })
  }

  deletePlayer(id:number){
    if(confirm("Da li ste sigurni da želite obrisati ovog igraca?")){
      this.playerService.delete(id).subscribe({
        next:() => {
          this.loadPlayers();
        },
        error:()=> alert("Greška pri brisanju!")
      });
    }
  }


  get filteredLeagues(): League[]{
    if(!this.selectedSportId)
      return this.leagues;
    return this.leagues.filter(l => l.sport?.id === this.selectedSportId);
  }

   get filteredTeams(): Team[]{
    if(!this.selectedLeagueId)
      return this.teams;
    return this.teams.filter(l => l.league?.id=== this.selectedLeagueId);
  }
  get availablePositions(): string[] {
    if (!this.selectedSportId) return [];
    const sport = this.sports.find(s => s.id === this.selectedSportId);
    if (!sport) return [];
    return this.positionsMap[sport.name] || [];
}

get filteredPlayers(): Player[] {
  let result = this.players;

  if (this.filterSportId) {
    result = result.filter(p => p.team?.sport?.id === this.filterSportId);
  }
  if (this.filterLeagueId) {
    result = result.filter(p => p.team?.league?.id === this.filterLeagueId);
  }
  if (this.filterTeamId) {
    result = result.filter(p => p.team?.id === this.filterTeamId);
  }
  return result;
}

get filterLeagues(): League[] {
  if (!this.filterSportId) return this.leagues;
  return this.leagues.filter(l => l.sport?.id === this.filterSportId);
}

get filterTeams(): Team[] {
  let result = this.teams;
  if (this.filterSportId) {
    result = result.filter(t => t.sport?.id === this.filterSportId);
  }
  if (this.filterLeagueId) {
    result = result.filter(t => t.league?.id === this.filterLeagueId);
  }
  return result;
}

onFilterSportChange() {
  this.filterLeagueId = null;
  this.filterTeamId = null;
}

onFilterLeagueChange() {
  this.filterTeamId = null;
}
}
