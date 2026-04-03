import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class League {
   private apiUrl = 'http://localhost:8080/api/leagues';

  constructor(private http:HttpClient){}

  getAll(): Observable<League[]> {
    return this.http.get<League[]>(this.apiUrl);
  }

  getById(id:number): Observable<League>{
    return this.http.get<League>(`${this.apiUrl}/${id}`);
  }

  create(league :League):Observable<League>{
    return this.http.post<League>(this.apiUrl,league);
  }

  update(id:number, league:League) : Observable<League>{
    return this.http.put<League>(`${this.apiUrl}/${id}`,league);
  }

  delete(id: number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBySport(sportId: number): Observable<League[]> {
  return this.http.get<League[]>(`${this.apiUrl}/sport/${sportId}`);
  }

}
