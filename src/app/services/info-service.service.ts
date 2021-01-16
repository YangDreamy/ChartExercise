import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoServiceService {


  constructor(private http: HttpClient) {
    this.getCSV().subscribe(data => {
        //console.log(data);
    });
  }

  public getCSV(): Observable<any> {
    return this.http.get("./assets/actuals-da-market-prices.csv", {responseType:"text"});//if not ,things will save in text
  }
}
