import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private apiUrl = 'http://localhost:8080/api/matches';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getById(id: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  create(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  update(id: number, match: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByLeague(leagueId: number): Observable<Match[]> {
  return this.http.get<Match[]>(`${this.apiUrl}/league/${leagueId}`);
  }

  getByTeam(teamId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/team/${teamId}`);
  }

}
