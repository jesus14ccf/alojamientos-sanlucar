import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL_API = 'https://alojamientossanlucar.es/api/';

  constructor(private http: HttpClient) {}

  login(usuario: string, clave: string): Observable<any> {
    return this.http.post(`${this.URL_API}auth.php`, {
      username: usuario,
      password: clave,
    });
  }

  setSession(token: string) {
    localStorage.setItem('auth_token', token);
  }

  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }
}

//Guardian para que no se pueda poner /admin directamente en el navegador y que entre
export const adminGuard = () => {
  const router = inject(Router);

  const token = localStorage.getItem('auth_token');

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
