import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL_API = 'https://alojamientossanlucar.es/api/';

  constructor(private http: HttpClient) { }

  login(usuario: string, clave: string): Observable<any> {
    return this.http.post(`${this.URL_API}auth.php`, { username: usuario, password: clave });
  }


  setSession(token: string) {
    localStorage.setItem('auth_token', token);
  }

  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }
}
