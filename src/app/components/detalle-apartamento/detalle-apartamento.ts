import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Propiedades, Propiedad, Foto } from '../../services/propiedades';

@Component({
  selector: 'app-detalle-apartamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-apartamento.html',
  styleUrl: './detalle-apartamento.scss',
})
export class DetalleApartamento implements OnInit {
  casa!: Propiedad;
  fotosGaleria: string[] = [];

  constructor(
    private propiedadService: Propiedades,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.cargarDetalles(id);
    }
  }

  cargarDetalles(id: number) {
    this.propiedadService.getPropiedadesById(id).subscribe({
      next: (data) => {
        this.casa = data;
        this.cargarFotos(id);
      },
      error: (err) => console.error('Error al cargar detalles:', err),
    });
  }
  cargarFotos(id: number) {
    this.propiedadService.getFotosPropiedad(id).subscribe({
      next: (fotos: Foto[]) => {
        this.fotosGaleria = [
          this.casa.imagen_principal, ...fotos.map((f) => f.ruta_foto),
        ];
      },
      error: (err) => {
        console.error('Error al cargar fotos:', err);
        this.fotosGaleria = [this.casa.imagen_principal];
      },
    });
  }
}
