import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { League } from './league.service';

@Injectable({
  providedIn: 'root',
})
export class Team {
   private apiUrl = 'http://localhost:8080/api/teams';

  constructor(private http:HttpClient){}

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getById(id:number): Observable<Team>{
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  create(sport :Team):Observable<Team>{
    return this.http.post<Team>(this.apiUrl,sport);
  }

  update(id:number, team:Team) : Observable<Team>{
    return this.http.put<Team>(`${this.apiUrl}/${id}`,team);
  }

  delete(id: number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByLeague(leagueId:number) :Observable<Team[]>{
      return this.http.get<Team[]>(`${this.apiUrl}/league/${leagueId}`);
  }

  getBySport(sportId:number) :Observable<Team[]>{
    return this.http.get<Team[]>(`${this.apiUrl}/sport/${sportId}`);
  }
}
