import { Component } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-descubre-sanlucar',
  imports: [],
  templateUrl: './descubre-sanlucar.html',
  styleUrl: './descubre-sanlucar.scss',
})
export class DescubreSanlucar {
  ngOnInit() {
    AOS.init();
  }
}
