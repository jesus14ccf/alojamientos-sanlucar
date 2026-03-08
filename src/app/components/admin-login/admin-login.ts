import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.auth.setSession("token_de_prueba");
          this.router.navigate(['/admin']);
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => this.error = 'Error de conexión con el servidor'
    });
  }

}
