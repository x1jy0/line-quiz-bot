import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private http: HttpClient) {}

  getQuestions(query: any): Observable<any> {
    const httpParams = qs.stringify(query);
    return this.http.get<any>(`${environment.API_URL}/questions?${httpParams}`);
  }

  getQuestionsCount(query: any): Observable<any> {
    const httpParams = qs.stringify(query);
    return this.http.get<any>(
      `${environment.API_URL}/questions/count?${httpParams}`
    );
  }

  createAnswer(body: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/answers?`, body);
  }

  getAnswer(query: any): Observable<any> {
    const httpParams = qs.stringify(query);
    return this.http.get<any>(`${environment.API_URL}/answers?${httpParams}`);
  }

  findUser(query: any): Observable<any> {
    const httpParams = qs.stringify(query);
    return this.http.get<any>(`${environment.API_URL}/users?${httpParams}`);
  }

  getCategories(query: any): Observable<any> {
    const httpParams = qs.stringify(query);
    return this.http.get<any>(
      `${environment.API_URL}/categories?${httpParams}`
    );
  }

  saveCategories(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/users/${id}`, body);
  }
}
