import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  id_reserva: number;
  id_propiedad: number;
  nombre_propiedad: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  huespedes: number;
  fecha_entrada: Date;
  fecha_salida: Date;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class Reservas {
private URL_API = 'https://alojamientossanlucar.es/api/reservas.php';

  constructor(private http: HttpClient) { }

  listarReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.URL_API);
  }

  cambiarEstado(id_reserva: number, nuevo_estado: string): Observable<any> {
    return this.http.put(this.URL_API, { id_reserva, nuevo_estado });
  }

  enviarPeticion(reserva: any): Observable<any> {
    return this.http.post(this.URL_API, reserva);
  }

  borrarReserva(id_reserva: number): Observable<any> {
    return this.http.delete(`${this.URL_API}?id=${id_reserva}`);
  }
}
