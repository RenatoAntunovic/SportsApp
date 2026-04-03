import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Standing } from '../models/standing.model';

@Injectable({ providedIn: 'root' })
export class StandingService {
  private apiUrl = 'http://localhost:8080/api/standings';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Standing[]> {
    return this.http.get<Standing[]>(this.apiUrl);
  }

  getById(id: number): Observable<Standing> {
    return this.http.get<Standing>(`${this.apiUrl}/${id}`);
  }

  create(standing: Standing): Observable<Standing> {
    return this.http.post<Standing>(this.apiUrl, standing);
  }

  update(id: number, standing: Standing): Observable<Standing> {
    return this.http.put<Standing>(`${this.apiUrl}/${id}`, standing);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByLeague(leagueId: number): Observable<Standing[]> {
  return this.http.get<Standing[]>(`${this.apiUrl}/league/${leagueId}`);
}

}
