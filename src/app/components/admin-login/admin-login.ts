import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Acceso Privado | Alojamientos Sanlúcar');
    this.metaService.updateTag({
      name: 'robots',
      content: 'noindex'
    });
  }

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.auth.setSession('token_de_prueba');
          this.router.navigate(['/admin']);
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => (this.error = 'Error de conexión con el servidor'),
    });
  }
}
