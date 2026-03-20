import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Propiedades, Propiedad, Foto } from '../../services/propiedades';

@Component({
  selector: 'app-detalle-apartamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-apartamento.html',
  styleUrl: './detalle-apartamento.scss',
})
export class DetalleApartamento implements OnInit {
  casa!: Propiedad;
  fotosGaleria: string[] = [];

  fotoActualIndex: number = 0;

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
          this.casa.imagen_principal,
          ...fotos.map((f) => f.ruta_foto),
        ];
      },
      error: (err) => {
        console.error('Error al cargar fotos:', err);
        this.fotosGaleria = [this.casa.imagen_principal];
      },
    });
  }

  fotoAnterior() {
    if (this.fotoActualIndex > 0) {
      this.fotoActualIndex--;
    } else {
      this.fotoActualIndex = this.fotosGaleria.length - 1;
    }
  }

  fotoSiguiente() {
    if (this.fotoActualIndex < this.fotosGaleria.length - 1) {
      this.fotoActualIndex++;
    } else {
      this.fotoActualIndex = 0;
    }
  }
}
