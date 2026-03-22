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
  habitaciones?: number;
  banos?: number;
  piscina?: number;
  wifi?: number;
  garaje?: number;
  padel?: number;
  id_usuario: number;
  capacidad: number;
  visible?: number;
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
  private URL_SUBIR_FOTOS = 'https://alojamientossanlucar.es/api/subir_fotos.php';
  private URL_FOTOS = 'https://alojamientossanlucar.es/api/fotos.php';
  private URL_BORRAR_FOTO = 'https://alojamientossanlucar.es/api/borrar_foto.php';
  private URL_BUSCAR = 'https://alojamientossanlucar.es/api/get_propiedades.php';
  private URL_RESERVA = 'https://alojamientossanlucar.es/api/reservas.php';

  constructor(private http: HttpClient) {}

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

  //   Filtrar alojamientos en apartamentos.html pasandole fechas
  getPropiedadesDisponibles(fechaEntrada: string, fechaSalida: string): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.URL_BUSCAR}?entrada=${fechaEntrada}&salida=${fechaSalida}`);
  }

  createPropiedad(p: Propiedad): Observable<any> {
    return this.http.post(this.URL_API, p);
  }

  deletePropiedad(id: number): Observable<any> {
    return this.http.delete(`${this.URL_API}?id=${id}`);
  }

  getFotosPropiedad(id: number): Observable<Foto[]> {
    return this.http.get<Foto[]>(`${this.URL_FOTOS}?id_propiedad=${id}`);
  }

  uploadFotos(idPropiedad: number, fotos: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('id_propiedad', idPropiedad.toString());

    for (let i = 0; i < fotos.length; i++) {
      formData.append('fotos[]', fotos[i]);
    }

    return this.http.post(this.URL_SUBIR_FOTOS, formData);
  }

  deleteFoto(idFoto: number): Observable<any> {
    return this.http.delete(`${this.URL_BORRAR_FOTO}?id_foto=${idFoto}`);
  }

  toggleVisibilidad(id: number, estadoVisible: number): Observable<any> {
    const payload = {
      accion: 'visibilidad',
      id_propiedad: id,
      visible: estadoVisible,
    };
    return this.http.put(this.URL_API, payload);
  }

  crearReserva(reservaData: any): Observable<any> {
    return this.http.post(this.URL_RESERVA, reservaData);
  }

}
