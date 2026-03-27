import { AfterViewInit, Component } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-descubre-sanlucar',
  imports: [],
  templateUrl: './descubre-sanlucar.html',
  styleUrl: './descubre-sanlucar.scss',
})
export class DescubreSanlucar implements AfterViewInit {
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
