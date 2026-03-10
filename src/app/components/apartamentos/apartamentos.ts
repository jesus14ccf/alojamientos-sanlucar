import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Propiedades, Propiedad } from '../../services/propiedades';

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './apartamentos.html',
  styleUrl: './apartamentos.scss',
})
export class Apartamentos implements OnInit {
  listaPropiedades: Propiedad[] = [];

  constructor(private apiService: Propiedades) {}

  ngOnInit(): void {
    this.cargarPropiedades();
  }
  cargarPropiedades() {
    this.apiService.getPropiedades().subscribe({
      next: (datos) => {
        this.listaPropiedades = datos.filter(casa => casa.visible != 0);
        console.log('Casas recibidas:', this.listaPropiedades); //voy a comprobar si las recibe por el inspector
      },
      error: (err) => {
        console.error('Error al traer casas:', err);
      }
    });
  }
}
