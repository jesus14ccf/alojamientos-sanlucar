import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { DetalleApartamento } from './components/detalle-apartamento/detalle-apartamento';
import { Contacto } from './components/contacto/contacto';
import { SobreNosotros } from './components/sobre-nosotros/sobre-nosotros';
import { DescubreSanlucar } from './components/descubre-sanlucar/descubre-sanlucar';
import { Apartamentos } from './components/apartamentos/apartamentos';
import { AdminLogin } from './components/admin-login/admin-login';
import { AdminPanel } from './components/admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'apartamentos', component: Apartamentos},
  { path: 'apartamento/:id', component: DetalleApartamento },
  { path: 'contacto', component: Contacto },
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'sanlucar', component: DescubreSanlucar },
  { path: 'login', component: AdminLogin },
  { path: 'admin', component: AdminPanel },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
