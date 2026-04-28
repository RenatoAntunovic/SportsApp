import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { League } from '../../../models/league.model';
import { Sport } from '../../../models/sport.model';
import { LeagueService } from '../../../services/league.service';
import { SportService } from '../../../services/sport.service';
import { FavoriteService } from '../../../services/favorite.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-leagues-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer, RouterLink],
  templateUrl: './leagues-page.html',
  styleUrl: './leagues-page.css',
})
export class LeaguesPage implements OnInit {
  leagues: League[] = [];
  sports: Sport[] = [];
  favoriteLeagueIds: Set<number> = new Set();
showOnlyFavorites = false;
  selectedSportId: number | null = null;

  constructor(
    private leagueService: LeagueService,
    private sportService: SportService,
    private favoriteService: FavoriteService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService : ToastService
  ) {}

  ngOnInit() {
    this.loadLeagues();
    this.loadSports();
    if (this.authService.isLoggedIn()) {
      this.loadFavorites();
    }
  }

  loadSports() {
    this.sportService.getAll().subscribe({
      next: (data) => {
        this.sports = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadLeagues() {
    this.leagueService.getAll().subscribe({
      next: (data) => {
        this.leagues = [...data];
        this.cdr.detectChanges();
      }
    });
  }

  loadFavorites() {
    this.favoriteService.getFavoriteLeagues().subscribe({
      next: (data) => {
        this.favoriteLeagueIds = new Set(data.map(l => l.id!));
        this.cdr.detectChanges();
      }
    });
  }

  isFavorite(leagueId: number): boolean {
    return this.favoriteLeagueIds.has(leagueId);
  }

 toggleFavorite(event: Event, leagueId: number) {
  event.stopPropagation();
  event.preventDefault();

  if (!this.authService.isLoggedIn()) {
    this.toastService.info('Prijavi se da bi dodao ligu u favorite');
    this.router.navigate(['/login']);
    return;
  }

  const wasAlreadyFavorite = this.favoriteLeagueIds.has(leagueId);

  this.favoriteService.toggleLeagueFavorite(leagueId).subscribe({
    next: () => {
      if (wasAlreadyFavorite) {
        this.favoriteLeagueIds.delete(leagueId);
        this.toastService.info('Liga uklonjena iz favorita');
      } else {
        this.favoriteLeagueIds.add(leagueId);
        this.toastService.success('Liga dodana u favorite');
      }
      this.cdr.detectChanges();
    },
    error: () => this.toastService.error('Greška pri ažuriranju favorita')
  });
}

  get filteredLeagues(): League[] {
    let result = this.leagues;

    if(this.selectedSportId){
      result = result.filter(x => x.sport?.id == this.selectedSportId);
    }

    if(this.showOnlyFavorites){
      result = result.filter(x => this.favoriteLeagueIds.has(x.id!));
    }

    return result;
  }
}