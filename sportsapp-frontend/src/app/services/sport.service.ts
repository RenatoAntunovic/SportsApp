import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sport } from '../models/sport.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private apiUrl = 'http://localhost:8080/api/sports';

  constructor(private http:HttpClient){}

  getAll(): Observable<Sport[]> {
    return this.http.get<Sport[]>(this.apiUrl);
  }

  getById(id:number): Observable<Sport>{
    return this.http.get<Sport>(`${this.apiUrl}/${id}`);
  }

  create(sport :Sport):Observable<Sport>{
    return this.http.post<Sport>(this.apiUrl,sport);
  }

  update(id:number, sport:Sport) : Observable<Sport>{
    return this.http.put<Sport>(`${this.apiUrl}/${id}`,sport);
  }

  delete(id: number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

  