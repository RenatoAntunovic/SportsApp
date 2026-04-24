import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { League } from '../../../models/league.model';
import { Sport } from '../../../models/sport.model';
import { LeagueService } from '../../../services/league.service';
import { SportService } from '../../../services/sport.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leagues-page',
  standalone: true,
  imports: [CommonModule,FormsModule,Navbar,Footer,RouterLink],
  templateUrl: './leagues-page.html',
  styleUrl: './leagues-page.css',
})
export class LeaguesPage implements OnInit{
  leagues: League[] = [];
  sports: Sport[] = [];
  
  selectedSportId : number | null = null;

  /**
   *
   */
  constructor(
    private leagueService: LeagueService,
    private sportService : SportService,
    private cdr : ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadLeagues();
    this.loadSports();
  }
  loadSports() {
    this.sportService.getAll().subscribe({
      next:(data) => {
        this.sports = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadLeagues() {
    this.leagueService.getAll().subscribe({
      next:(data) => {
        this.leagues = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredLeagues(): League[]{
    if(!this.selectedSportId) return this.leagues;
    return this.leagues.filter(x=>x.sport?.id == this.selectedSportId);
  }
}
