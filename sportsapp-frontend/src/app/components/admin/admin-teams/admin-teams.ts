import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { League } from '../../../models/league.model';
import { Sport } from '../../../models/sport.model';
import { Team } from '../../../models/team.model';
import { LeagueService } from '../../../services/league.service';
import { TeamService } from '../../../services/team.service';
import { SportService } from '../../../services/sport.service';

@Component({
  selector: 'app-admin-teams',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-teams.html',
  styleUrl: './admin-teams.css',
  standalone: true,
})
export class AdminTeams implements OnInit{
  leagues: League[] = [];
  sports : Sport[] = [];
  teams: Team[] = [];
  showModal = false;

  editMode = false;
  editId : number|null = null;
  saving = false;

  selectedSportId : number|null = null;
  selectedLeagueId : number|null = null;
  form : Team = {name:'', country: '' ,logoUrl: ''};

  /**
   *
   */
  constructor(
    private leagueService :LeagueService,
    private sportService: SportService,
    private teamService : TeamService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadLeagues();
    this.loadSports();
    this.loadTeams();
  }
  loadTeams() {
    this.teamService.getAll().subscribe({
      next: (data) => {
        this.teams = [...data];
        this.cdr.detectChanges();
      },
      error(err) {
        console.error("Load teams error: ",err)
      },
    })
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

openModal(team?:Team){
  this.saving = false;

  if(team){
    this.editMode = true;
    this.editId = team.id!;
    this.form = {...team};
    this.selectedSportId = team.sport?.id ?? null;
    this.selectedLeagueId = team.league?.id ?? null;
  }else{
    this.editMode = false;
    this.editId = null;
    this.form = {name:'', country: '' ,logoUrl: ''};
    this.selectedLeagueId = null;
    this.selectedSportId = null;
}
  this.showModal = true;
}

closeModal(){
  this.saving = false;
  this.showModal = false;
}

saveTeam(){
  if(!this.form.name || this.saving)
    return;

  this.saving = true;

  const selectedSport = this.sports.find(x => x.id === this.selectedSportId) || undefined;
  const selectedLeague = this.leagues.find(x => x.id === this.selectedLeagueId) || undefined;

  const teamToSave : Team = {
    ...this.form,
    sport: selectedSport,
    league: selectedLeague
  };

  const request = this.editMode && this.editId ? this.teamService.update(this.editId,teamToSave)
  :this.teamService.create(teamToSave);

  request.subscribe({
    next: () => {
      this.saving = false;
      this.showModal = false;
      this.loadTeams();
    },
    error: (err) =>{
      console.error('Save error: ',err);
      this.saving = false;
    },
  })
}

deleteTeam(id: number){
  if(confirm('Jesi li siguran da želis obrisati ovaj tim')){
    this.teamService.delete(id).subscribe({
      next: () => this.loadTeams(),
      error:() => alert("'Ne možeš obrisati tim koji ima vezane igrače, mečeve ili standings!'")
    })
  }
}

get filteredLeagues(): League[]{
  if(!this.selectedSportId)
    return this.leagues;
  return this.leagues.filter(x => x.sport?.id === this.selectedSportId);
}
}



