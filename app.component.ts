import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  readonly risultati$ = new BehaviorSubject({});

  async click() {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3000/api/search/professionisti',
      { // Dati di Sonia Turner
        latitude: 61.5466, longitude: 77.7193, raggio: 29, job: 'Director'
      })
    );
    this.risultati$.next(res);
  }
}
