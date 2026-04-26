import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { League } from '../models/league.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8080/api/favorites';

  constructor(private http: HttpClient) {}

  getFavoriteTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }

  getFavoriteLeagues(): Observable<League[]> {
    return this.http.get<League[]>(`${this.apiUrl}/leagues`);
  }

  toggleTeamFavorite(teamId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/teams/${teamId}`, {});
  }

  toggleLeagueFavorite(leagueId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/leagues/${leagueId}`, {});
  }
}