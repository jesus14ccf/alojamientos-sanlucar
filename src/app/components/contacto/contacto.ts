import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})

export class Contacto implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Contacto | Alojamientos Sanlucar');

    this.metaService.updateTag({
      name: 'description',
      content:
        'Contacta con Alojamientos Sanlucar. Estamos aquí para resolver tus dudas y ayudarte a organizar tus vacaciones.',
    });
  }
}
