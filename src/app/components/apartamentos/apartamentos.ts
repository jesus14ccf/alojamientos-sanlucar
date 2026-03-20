import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Propiedades, Propiedad } from '../../services/propiedades';

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './apartamentos.html',
  styleUrl: './apartamentos.scss',
})
export class Apartamentos implements OnInit {
  listaPropiedades: Propiedad[] = [];

  fechaEntrada: string = '';
  fechaSalida: string = '';

  constructor(private apiService: Propiedades) {}

  ngOnInit(): void {
    this.cargarPropiedades();
  }

  buscarDisponibilidad() {
    if (!this.fechaEntrada || !this.fechaSalida) {
      alert('Por favor, selecciona las fechas de entrada y salida.');
      return;
    }

    const entrada = new Date(this.fechaEntrada);
    const salida = new Date(this.fechaSalida);

    if (salida <= entrada) {
      alert('La fecha de salida debe ser posterior a la fecha de entrada.');
      return;
    }

    console.log(
      `Buscando casas libres desde el ${this.fechaEntrada} hasta el ${this.fechaSalida}`,
    );

    this.apiService.getPropiedadesDisponibles(this.fechaEntrada, this.fechaSalida).subscribe({
      next: (casasDisponibles) => {
        this.listaPropiedades = casasDisponibles;

        if (this.listaPropiedades.length === 0) {
          alert('Lo sentimos, no hay alojamientos disponibles para esas fechas. Prueba con otros días.');
        }
      },
      error: (err) => {
        console.error('Error al buscar disponibilidad:', err);
        alert('Hubo un problema de conexión al buscar. Inténtalo de nuevo.');
      }
    });
  }

  cargarPropiedades() {
    this.apiService.getPropiedades().subscribe({
      next: (datos) => {
        this.listaPropiedades = datos.filter((casa) => casa.visible != 0);
        console.log('Casas recibidas:', this.listaPropiedades); //voy a comprobar si las recibe por el inspector
      },
      error: (err) => {
        console.error('Error al traer casas:', err);
      },
    });
  }

}
