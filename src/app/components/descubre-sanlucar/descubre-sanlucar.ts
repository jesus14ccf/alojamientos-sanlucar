import { AfterViewInit, Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-descubre-sanlucar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './descubre-sanlucar.html',
  styleUrl: './descubre-sanlucar.scss',
})
export class DescubreSanlucar implements AfterViewInit {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Descubre Sanlucar | Alojamientos Sanlucar');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Descubre qué ver y hacer en Sanlucar de Barrameda. Gastronomía, playas, Doñana y los mejores rincones cerca de tu alojamiento.',
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
