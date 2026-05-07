import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const landingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
 
  if (authService.isLoggedIn() && authService.getRole() === 'ADMIN') {
    if (state.url === '/login' || state.url === '/register') {
      router.navigate(['/admin']);
      return false;
    }
  }
  
  return true;
};