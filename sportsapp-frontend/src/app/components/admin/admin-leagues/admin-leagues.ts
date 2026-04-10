import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeagueService } from '../../../services/league.service';
import { SportService } from '../../../services/sport.service';
import { League } from '../../../models/league.model';
import { Sport } from '../../../models/sport.model';

@Component({
  selector: 'app-admin-leagues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-leagues.html',
  styleUrl: './admin-leagues.css'
})
export class AdminLeagues implements OnInit {

  leagues: League[] = [];
  sports: Sport[] = [];
  showModal = false;
  
  editMode = false;
  editId: number | null = null;
  saving = false;
  
  selectedSportId: number | null = null;
  
  // Forma — podaci koje korisnik unosi
  form: League = { name: '', country: '', logoUrl: '' };

  constructor(
    private leagueService: LeagueService,
    private sportService: SportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
   
    this.loadLeagues();
    this.loadSports();
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

  loadSports() {
    this.sportService.getAll().subscribe({
      next: (data) => this.sports = [...data],
      error: (err) => console.error('Load sports error:', err)
    });
  }

  openModal(league?: League) {
   
    this.saving = false;
    
    if (league) {
     
      this.editMode = true;
      this.editId = league.id!;
      this.form = { ...league };   
      this.selectedSportId = league.sport?.id ?? null;
    } else {
      this.editMode = false;
      this.editId = null;
      this.form = { name: '', country: '', logoUrl: '' };
      this.selectedSportId = null;
    }
    this.showModal = true;
  }

  closeModal() {
    this.saving = false;
    this.showModal = false;
  }

  saveLeague() {
    if (!this.form.name || this.saving) return;
    this.saving = true;

    const selectedSport = this.sports.find(s => s.id === this.selectedSportId) || undefined;
    
    const leagueToSave: League = {
      ...this.form,
      sport: selectedSport
    };

    const request = this.editMode && this.editId
      ? this.leagueService.update(this.editId, leagueToSave)
      : this.leagueService.create(leagueToSave);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadLeagues();
      },
      error: (err) => {
        console.error('Save error:', err);
        this.saving = false;
      }
    });
  }

  deleteLeague(id: number) {
    if (confirm('Jesi li siguran da želiš obrisati ovu ligu?')) {
      this.leagueService.delete(id).subscribe({
        next: () => this.loadLeagues(),
        error: () => alert('Ne možeš obrisati ligu koja ima vezane timove!')
      });
    }
  }
}