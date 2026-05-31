import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.scss',
})
export class SobreNosotros implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Sobre Nosotros | Alojamientos Sanlucar');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Conoce nuestra historia y dedicación. En Alojamientos Sanlucar trabajamos para ofrecerte la mejor experiencia y confort en tus vacaciones.',
    });
  }
}
