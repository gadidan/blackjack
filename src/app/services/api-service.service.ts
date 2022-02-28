import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Card } from '../model/card.model';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  baseUrl: string;
  constructor(private http: HttpClient) { 
    this.baseUrl = environment.baseUrl;
  }

  httpOptions = {
    headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200', 
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
        'Access-Control-Allow-Credentials':'true',
        'Access-Control-Allow-Headers':'Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization',
        'Access-Control-Expose-Headers':'xsrf-token'
    })
  };

  public getCheateData(playerCard:Card[], computerCards: Card[]){
    let params= {playerCard ,computerCards}; 
   
    return this.http.post(this.baseUrl + 'data',params, {withCredentials: true})
  }

}
