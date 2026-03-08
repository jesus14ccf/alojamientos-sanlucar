import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Propiedad {
  id_propiedad: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  precio_noche: number;
  imagen_principal: string;
  id_usuario: number;
  capacidad: number;
}

export interface Foto {
  id_foto: number;
  ruta_foto: string;
  id_propiedad: number;
}

@Injectable({
  providedIn: 'root',
})
export class Propiedades {
  private URL_API = 'https://alojamientossanlucar.es/api/admin_propiedades.php';
  private URL_OCUPACION = 'https://alojamientossanlucar.es/api/ocupacion.php';

  constructor(private http: HttpClient) { }

  getPropiedades(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.URL_API);
  }

  getPropiedadesById(id: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.URL_API}?id=${id}`);
  }

  //para poder filtrar fechas en el calendario
  getOcupacion(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_OCUPACION}?id=${id}`);
  }

  createPropiedad(p: Propiedad): Observable<any> {
    return this.http.post(this.URL_API, p);
  }

  deletePropiedad(id: number): Observable<any> {
    return this.http.delete(`${this.URL_API}?id=${id}`);
  }

getFotosPropiedad(id: number): Observable<Foto[]> {
  return this.http.get<Foto[]>(`https://alojamientossanlucar.es/api/fotos.php?id_propiedad=${id}`);
}

}
