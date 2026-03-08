import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Propiedades, Propiedad } from '../../services/propiedades';
import { Reservas, Reserva } from '../../services/reservas';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel implements OnInit{
  listaCasas: Propiedad[] = [];
  listaReservas: Reserva[] = [];

  seccionActual: 'alojamientos' | 'reservas' = 'alojamientos';
  mostrarFormulario: boolean = false;

  nuevaPropiedad: any = {
    nombre: '',
    descripcion: '',
    ubicacion: '',
    precio_noche: 0,
    imagen_principal: '',
    capacidad: 1,
    id_usuario: 1
  };

  constructor(
    private propiedadService: Propiedades,
    private reservaService: Reservas,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.propiedadService.getPropiedades().subscribe({
      next: (data: Propiedad[]) => (this.listaCasas = data),
      error: (err: any) => console.error('Error al cargar propiedades:', err)
    });

    this.reservaService.listarReservas().subscribe({
      next: (data: Reserva[]) => (this.listaReservas = data),
      error: (err: any) => console.error('Error al listar reservas', err)
    });
  }

  cambiarSeccion(seccion: 'alojamientos' | 'reservas') {
    this.seccionActual = seccion;
    this.mostrarFormulario = false;
  }

  crearPropiedad() {
    this.propiedadService.createPropiedad(this.nuevaPropiedad).subscribe({
      next: () => {
        alert('Propiedad añadida con éxito');
        this.mostrarFormulario = false;
        this.cargarDatos();
        this.nuevaPropiedad = { nombre: '', descripcion: '', ubicacion: '', precio_noche: 0, imagen_principal: '', capacidad: 1, id_usuario: 1 };
      },
      error: (err) => alert('Error al crear la propiedad')
    });
  }

  borrarCasa(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este alojamiento?')) {
      this.propiedadService.deletePropiedad(id).subscribe({
        next: () => {
          alert('Propiedad eliminada con éxito');
          this.cargarDatos();
        },
        error: (err) => console.error('Error al borrar:', err),
      });
    }
  }

  actualizarEstado(idReserva: number, nuevoEstado: string): void {
    this.reservaService.cambiarEstado(idReserva, nuevoEstado).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => alert('Error al actualizar la reserva')
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

}
