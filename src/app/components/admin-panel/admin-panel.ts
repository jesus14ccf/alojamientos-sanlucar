import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Propiedades, Propiedad } from '../../services/propiedades';
import { Reservas, Reserva } from '../../services/reservas';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel implements OnInit {
  listaCasas: Propiedad[] = [];
  listaReservas: Reserva[] = [];
  fotosSeleccionadas: File[] = [];
  mostrarGestorFotos: boolean = false;
  casaSeleccionadaParaFotos: any = null;
  fotosActuales: any[] = [];
  fotosExtraNuevas: File[] = [];
  reservasFiltradas: Reserva[] = [];
  fechaFiltroInicio: string = '';
  fechaFiltroFin: string = '';
  fotoPrincipalSeleccionada: File | null = null;
  mostrarModalBloqueo: boolean = false;
  casaSeleccionadaParaBloqueo: any = null;
  fechaInicioBloqueo: string = '';
  fechaFinBloqueo: string = '';

  seccionActual: 'alojamientos' | 'reservas' = 'alojamientos';
  mostrarFormulario: boolean = false;

  nuevaPropiedad: any = {
    nombre: '',
    descripcion: '',
    ubicacion: '',
    precio_noche: 0,
    imagen_principal: '',
    capacidad: 1,
    habitaciones: 1,
    banos: 1,
    piscina: 0,
    wifi: 0,
    garaje: 0,
    padel: 0,
    id_usuario: 1,
  };

  constructor(
    private propiedadService: Propiedades,
    private reservaService: Reservas,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.fotosSeleccionadas = Array.from(event.target.files);
    }
  }

  cargarDatos() {
    this.propiedadService.getPropiedades().subscribe({
      next: (data: Propiedad[]) => (this.listaCasas = data),
      error: (err: any) => console.error('Error al cargar propiedades:', err),
    });

    this.reservaService.listarReservas().subscribe({
      next: (data: Reserva[]) => {
        this.listaReservas = data;
        this.reservasFiltradas = [...data];
      },
      error: (err: any) => console.error('Error al listar reservas', err),
    });
  }

  cambiarSeccion(seccion: 'alojamientos' | 'reservas') {
    this.seccionActual = seccion;
    this.mostrarFormulario = false;
  }

  onFotoPrincipalSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoPrincipalSeleccionada = file;
      console.log('Foto principal lista para subir:', file.name);
    }
  }

  crearPropiedad() {
    const formData = new FormData();

    formData.append('nombre', this.nuevaPropiedad.nombre);
    formData.append('ubicacion', this.nuevaPropiedad.ubicacion);
    formData.append('descripcion', this.nuevaPropiedad.descripcion);
    formData.append(
      'precio_noche',
      this.nuevaPropiedad.precio_noche.toString(),
    );
    formData.append('capacidad', this.nuevaPropiedad.capacidad.toString());
    formData.append(
      'habitaciones',
      this.nuevaPropiedad.habitaciones.toString(),
    );
    formData.append('banos', this.nuevaPropiedad.banos.toString());
    formData.append('piscina', this.nuevaPropiedad.piscina.toString());
    formData.append('wifi', this.nuevaPropiedad.wifi.toString());
    formData.append('garaje', this.nuevaPropiedad.garaje.toString());
    formData.append('padel', this.nuevaPropiedad.padel.toString());

    if (this.fotoPrincipalSeleccionada) {
      formData.append('imagen_principal', this.fotoPrincipalSeleccionada);
    } else {
      alert('Por favor, selecciona la imagen principal de la casa');
      return;
    }

    this.propiedadService.createPropiedad(formData).subscribe({
      next: (res: any) => {
        const nuevoId = res.id;

        if (this.fotosSeleccionadas.length > 0 && nuevoId) {
          this.propiedadService
            .uploadFotos(nuevoId, this.fotosSeleccionadas)
            .subscribe({
              next: () => {
                alert('Propiedad y fotos de la galería añadidas con éxito');
                this.resetearFormulario();
              },
              error: (err) => {
                console.error('Error al subir las fotos:', err);
                alert(
                  'La propiedad se creó, pero hubo un fallo al subir las fotos extra.',
                );
                this.resetearFormulario();
              },
            });
        } else {
          alert('No se añadio correctamente');
          this.resetearFormulario();
        }
      },
      error: (err) => alert('Error al crear la propiedad'),
    });
  }

  resetearFormulario() {
    this.mostrarFormulario = false;
    this.cargarDatos();
    this.fotosSeleccionadas = [];
    this.nuevaPropiedad = {
      nombre: '',
      descripcion: '',
      ubicacion: '',
      precio_noche: 0,
      imagen_principal: '',
      capacidad: 1,
      habitaciones: 1,
      banos: 1,
      piscina: 0,
      wifi: 0,
      garaje: 0,
      padel: 0,
      id_usuario: 1,
    };
  }

  borrarCasa(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este alojamiento?')) {
      this.propiedadService.deletePropiedad(id).subscribe({
        next: () => {
          alert('Propiedad eliminada con éxito');
          this.cargarDatos();
        },
        error: (err) => console.error('Error al borrar:', err),
      });
    }
  }

  actualizarEstado(idReserva: number, nuevoEstado: string): void {
    console.log(
      `Enviando estado '${nuevoEstado}' para la reserva ID: ${idReserva}`,
    );

    this.reservaService.cambiarEstado(idReserva, nuevoEstado).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del servidor:', respuesta);

        if (respuesta.status === 'success') {
          const index = this.listaReservas.findIndex(
            (r) => r.id_reserva === idReserva,
          );
          if (index !== -1) {
            this.reservasFiltradas[index].estado = nuevoEstado;
          }
        } else {
          alert('Error del servidor: ' + respuesta.message);
        }
      },
      error: (err) => {
        console.error('Error HTTP fatal:', err);
        alert(
          'Fallo al conectar con el servidor para actualizar. Mira la consola.',
        );
      },
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  cambiarVisibilidad(casa: any) {
    const nuevoEstado = casa.visible == 0 ? 1 : 0;
    this.propiedadService
      .toggleVisibilidad(casa.id_propiedad, nuevoEstado)
      .subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => alert('Error al cambiar la visibilidad de la casa'),
      });
  }

  abrirGestorFotos(casa: any) {
    this.casaSeleccionadaParaFotos = casa;
    this.mostrarGestorFotos = true;
    this.cargarFotosDeLaCasa(casa.id_propiedad);
  }

  cerrarGestorFotos() {
    this.mostrarGestorFotos = false;
    this.casaSeleccionadaParaFotos = null;
    this.fotosActuales = [];
    this.fotosExtraNuevas = [];
  }

  cargarFotosDeLaCasa(idPropiedad: number) {
    this.propiedadService.getFotosPropiedad(idPropiedad).subscribe({
      next: (fotos) => {
        this.fotosActuales = fotos;
      },
      error: (err) => console.error('Error al cargar fotos', err),
    });
  }

  eliminarFoto(idFoto: number) {
    if (confirm('¿Seguro que quieres borrar esta foto de forma permanente?')) {
      this.propiedadService.deleteFoto(idFoto).subscribe({
        next: () => {
          this.cargarFotosDeLaCasa(this.casaSeleccionadaParaFotos.id_propiedad);
        },
        error: (err) => alert('Error al borrar la foto'),
      });
    }
  }

  onFotosExtraSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.fotosExtraNuevas = Array.from(event.target.files);
    }
  }

  subirFotosNuevas() {
    if (this.fotosExtraNuevas.length === 0) return;

    this.propiedadService
      .uploadFotos(
        this.casaSeleccionadaParaFotos.id_propiedad,
        this.fotosExtraNuevas,
      )
      .subscribe({
        next: () => {
          alert('Fotos añadidas a la galería');
          this.fotosExtraNuevas = [];
          this.cargarFotosDeLaCasa(this.casaSeleccionadaParaFotos.id_propiedad);
        },
        error: (err) => alert('Error al subir las nuevas fotos'),
      });
  }

  ejecutarBloqueo() {
    if (!this.fechaInicioBloqueo || !this.fechaFinBloqueo) {
      alert(
        'Por favor, selecciona las fechas de entrada y salida para bloquear.',
      );
      return;
    }

    const datosBloqueo = {
      id_propiedad: this.casaSeleccionadaParaBloqueo.id_propiedad,
      fecha_entrada: this.fechaInicioBloqueo,
      fecha_salida: this.fechaFinBloqueo,
      nombre: 'BLOQUEO MANUAL ADMIN',
      email: 'admin@alojamientos.com',
      telefono: '000000000',
      huespedes: 1,
    };

    this.propiedadService.crearReserva(datosBloqueo).subscribe({
      next: (res) => {
        alert('Fechas bloqueadas correctamente en el calendario.');
        this.cerrarModalBloqueo();
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al intentar bloquear las fechas.');
      },
    });
  }

  abrirModalBloqueo(casa: any) {
    this.casaSeleccionadaParaBloqueo = casa;
    this.fechaInicioBloqueo = '';
    this.fechaFinBloqueo = '';
    this.mostrarModalBloqueo = true;
  }

  cerrarModalBloqueo() {
    this.mostrarModalBloqueo = false;
    this.casaSeleccionadaParaBloqueo = null;
  }

  borrarReserva(idReserva: number): void {
    if (
      confirm(
        '¿Estás seguro de que quieres borrar esta reserva definitivamente?',
      )
    ) {
      this.reservaService.borrarReserva(idReserva).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            alert('Reserva borrada del historial');
            this.cargarDatos();
          } else {
            alert('Error al borrar: ' + res.message);
          }
        },
        error: (err) => {
          console.error('Error al borrar reserva', err);
          alert('Error de conexión al intentar borrar.');
        },
      });
    }
  }

  filtrarReservas() {
    if (!this.fechaFiltroInicio && !this.fechaFiltroFin) {
      this.reservasFiltradas = [...this.listaReservas];
      return;
    }

    this.reservasFiltradas = this.listaReservas.filter((res) => {
      let pasaFiltro = true;
      const fechaEntradaRes = new Date(res.fecha_entrada);

      if (this.fechaFiltroInicio) {
        const fInicio = new Date(this.fechaFiltroInicio);
        if (fechaEntradaRes < fInicio) pasaFiltro = false;
      }

      if (this.fechaFiltroFin) {
        const fFin = new Date(this.fechaFiltroFin);
        if (fechaEntradaRes > fFin) pasaFiltro = false;
      }

      return pasaFiltro;
    });
  }

  limpiarFiltro() {
    this.fechaFiltroInicio = '';
    this.fechaFiltroFin = '';
    this.reservasFiltradas = [...this.listaReservas];
  }
}
