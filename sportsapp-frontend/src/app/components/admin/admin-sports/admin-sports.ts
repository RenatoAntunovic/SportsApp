import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SportService } from '../../../services/sport.service';
import { Sport } from '../../../models/sport.model';

@Component({
  selector: 'app-admin-sports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sports.html',
  styleUrl: './admin-sports.css'
})
export class AdminSports implements OnInit {
  sports: Sport[] = [];
  showModal = false;
  editMode = false;
  editId: number | null = null;
  saving = false;
  form: Sport = { name: '', iconUrl: '' };

  constructor(
    private sportService: SportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSports();
  }

  loadSports() {
    this.sportService.getAll().subscribe({
      next: (data) => {
        this.sports = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load error:', err)
    });
  }

  openModal(sport?: Sport) {
    this.saving = false;
    if (sport) {
      this.editMode = true;
      this.editId = sport.id!;
      this.form = { ...sport };
    } else {
      this.editMode = false;
      this.editId = null;
      this.form = { name: '', iconUrl: '' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.saving = false;
    this.showModal = false;
  }

  saveSport() {
    if (!this.form.name || this.saving) return;
    this.saving = true;

    const request = this.editMode && this.editId
      ? this.sportService.update(this.editId, this.form)
      : this.sportService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadSports();
      },
      error: (err) => {
        console.error('Save error:', err);
        this.saving = false;
      }
    });
  }

  deleteSport(id: number) {
    if (confirm('Jesi li siguran da želiš obrisati ovaj sport?')) {
      this.sportService.delete(id).subscribe({
        next: () => this.loadSports(),
        error: (err) => {
          alert('Ne možeš obrisati sport koji ima vezane lige!');
          console.error(err);
        }
      });
    }
  }
}