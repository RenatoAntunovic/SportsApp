import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { Footer } from '../shared/footer/footer';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { Team } from '../../models/team.model';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: User | null = null;
  favoriteTeams: Team[] = [];
  favoriteLeagues: League[] = [];

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Forme
  profileForm = { username: '', email: '' };
  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

  // Stanja
  saving = false;
  changingPassword = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUser();
    this.loadFavorites();
  }

  loadUser() {
    this.userService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.username = data.username;
        this.profileForm.email = data.email;
        this.cdr.detectChanges();
      },
      error: () => this.toastService.error('Greška pri učitavanju profila')
    });
  }

  loadFavorites() {
    this.favoriteService.getFavoriteTeams().subscribe({
      next: (data) => {
        this.favoriteTeams = [...data];
        this.cdr.detectChanges();
      }
    });
    this.favoriteService.getFavoriteLeagues().subscribe({
      next: (data) => {
        this.favoriteLeagues = [...data];
        this.cdr.detectChanges();
      }
    });
  }

 updateProfile() {
  if (this.saving) return;

  if (!this.profileForm.username || !this.profileForm.email) {
    this.toastService.error('Sva polja su obavezna');
    return;
  }

  this.saving = true;
  this.userService.updateMe(this.profileForm).subscribe({
    next: (data) => {
  this.saving = false;
  
  // Ako je email promijenjen, izloguj korisnika
  if (data.email !== this.user!.email) {
    setTimeout(() => {
      this.toastService.success('Email promijenjen. Prijavi se ponovo.');
    });
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    }, 2000);
    return;
  }
  
  this.user = data;
  this.profileForm.username = data.username;
  this.profileForm.email = data.email;
  setTimeout(() => {
    this.toastService.success('Profil ažuriran');
    this.cdr.detectChanges();
  });
},
error: (err) => {
  this.saving = false;
  setTimeout(() => {
    this.toastService.error(err.error?.message || 'Greška pri ažuriranju');
    this.cdr.detectChanges();
  });
}
  });
}

  changePassword() {
    if (this.changingPassword) return;

    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
      this.toastService.error('Unesi sve lozinke');
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.toastService.error('Nova lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastService.error('Nove lozinke se ne podudaraju');
      return;
    }

    this.changingPassword = true;
  this.userService.changePassword({
    currentPassword: this.passwordForm.currentPassword,
    newPassword: this.passwordForm.newPassword
  }).subscribe({
    next: () => {
      this.changingPassword = false;
      this.passwordForm.currentPassword = '';
      this.passwordForm.newPassword = '';
      this.passwordForm.confirmPassword = '';
      this.toastService.success('Lozinka uspješno promijenjena');
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.changingPassword = false;
      this.toastService.error(err.error?.message || 'Greška pri promjeni lozinke');
      this.cdr.detectChanges();
    }
  });
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getTeamInitials(name: string | undefined): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  removeFavoriteTeam(event: Event, teamId: number) {
  
  event.stopPropagation();
  event.preventDefault();

  this.favoriteService.toggleTeamFavorite(teamId).subscribe({
    next: () => {
      this.favoriteTeams = this.favoriteTeams.filter(t => t.id !== teamId);
      this.toastService.info('Tim uklonjen iz favorita');
      this.cdr.detectChanges();
    },
    error: () => this.toastService.error('Greška pri uklanjanju')
  });
}

removeFavoriteLeague(event: Event, leagueId: number) {
  event.stopPropagation();
  event.preventDefault();

  this.favoriteService.toggleLeagueFavorite(leagueId).subscribe({
    next: () => {
      this.favoriteLeagues = this.favoriteLeagues.filter(l => l.id !== leagueId);
      this.toastService.info('Liga uklonjena iz favorita');
      this.cdr.detectChanges();
    },
    error: () => this.toastService.error('Greška pri uklanjanju')
  });
}
}