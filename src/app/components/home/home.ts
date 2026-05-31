import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}


  ngOnInit(): void {
    this.titleService.setTitle('Alojamientos Sanlucar | Alquiler Vacacional');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Reserva los mejores alojamientos turísticos en Sanlucar de Barrameda. Apartamentos y casas vacacionales al mejor precio para tus vacaciones.',
    });
  }

  ngAfterViewInit() {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    const elementosAnimables = document.querySelectorAll('.animable');
    elementosAnimables.forEach((el) => observador.observe(el));
  }
}
