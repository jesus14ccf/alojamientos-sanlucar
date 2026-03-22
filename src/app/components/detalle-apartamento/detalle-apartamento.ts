import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Propiedades, Propiedad, Foto } from '../../services/propiedades';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-apartamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle-apartamento.html',
  styleUrl: './detalle-apartamento.scss',
})
export class DetalleApartamento implements OnInit {
  casa!: Propiedad;
  fotosGaleria: string[] = [];

  fotosCarrusel: string[] = [];
  fotosAbstractas: string[] = [];

  todasLasFotos: string[] = [];
  mostrarModal: boolean = false;
  fotoModalIndex: number = 0;

  fotoActualIndex: number = 0;

  mesActual: Date = new Date();
  diasCalendario: any[] = [];
  nombresMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  fechaEntrada: Date | null = null;
  fechaSalida: Date | null = null;
  reservasConfirmadas: any[] = [];

  datosCliente = {
    nombre: '',
    email: '',
    telefono: '',
    huespedes: null,
  };

  mostrarModalExito: boolean = false;

  constructor(
    private propiedadService: Propiedades,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.cargarDetalles(id);
    }
    this.generarCalendario();
  }

  cargarDetalles(id: number) {
    this.propiedadService.getPropiedadesById(id).subscribe({
      next: (data) => {
        this.casa = data;
        this.cargarFotos(id);

        this.propiedadService.getOcupacion(id).subscribe({
          next: (reservas: any[]) => {
            this.reservasConfirmadas = reservas;
            this.generarCalendario();
          },
          error: (err) => {
            console.error('Error al cargar ocupacion:', err);
            this.generarCalendario();
          },
        });
      },
      error: (err) => console.error('Error al cargar detalles:', err),
    });
  }

  cargarFotos(id: number) {
    this.propiedadService.getFotosPropiedad(id).subscribe({
      next: (fotos: Foto[]) => {
        this.todasLasFotos = [
          this.casa.imagen_principal,
          ...fotos.map((f: any) => f.ruta_foto),
        ];

        this.fotosCarrusel = this.todasLasFotos.slice(0, 5);
        this.fotosAbstractas = this.todasLasFotos.slice(5, 11);
        this.fotosGaleria = this.fotosCarrusel;
      },
      error: (err) => {
        console.error('Error al cargar fotos:', err);
        this.fotosGaleria = [this.casa.imagen_principal];
        this.fotosCarrusel = [this.casa.imagen_principal];
        this.fotosAbstractas = [];
      },
    });
  }

  fotoAnterior() {
    if (this.fotoActualIndex > 0) {
      this.fotoActualIndex--;
    } else {
      this.fotoActualIndex = this.fotosGaleria.length - 1;
    }
  }

  fotoSiguiente() {
    if (this.fotoActualIndex < this.fotosGaleria.length - 1) {
      this.fotoActualIndex++;
    } else {
      this.fotoActualIndex = 0;
    }
  }

  abrirModal(indexGlobal: number) {
    this.fotoModalIndex = indexGlobal;
    this.mostrarModal = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.mostrarModal = false;
    document.body.style.overflow = 'auto';
  }

  modalAnterior() {
    if (this.fotoModalIndex > 0) {
      this.fotoModalIndex--;
    } else {
      this.fotoModalIndex = this.todasLasFotos.length - 1;
    }
  }

  modalSiguiente() {
    if (this.fotoModalIndex < this.todasLasFotos.length - 1) {
      this.fotoModalIndex++;
    } else {
      this.fotoModalIndex = 0;
    }
  }

  generarCalendario() {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    const primerDia = new Date(year, month, 1).getDay();
    let huecos = primerDia === 0 ? 6 : primerDia - 1;
    const diasEnMes = new Date(year, month + 1, 0).getDate();

    this.diasCalendario = [];
    for (let i = 0; i < huecos; i++) {
      this.diasCalendario.push({ vacio: true });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 1; i <= diasEnMes; i++) {
      const fechaDelDia = new Date(year, month, i);
      let estaOcupado = false;

      if (fechaDelDia < hoy) {
        estaOcupado = true;
      }

      else if (
        this.reservasConfirmadas &&
        this.reservasConfirmadas.length > 0
      ) {

        const mesStr = String(month + 1).padStart(2, '0');
        const diaStr = String(i).padStart(2, '0');
        const fechaString = `${year}-${mesStr}-${diaStr}`;

        for (let res of this.reservasConfirmadas) {
          if (
            fechaString >= res.fecha_entrada &&
            fechaString < res.fecha_salida
          ) {
            estaOcupado = true;
            break;
          }
        }
      }

      this.diasCalendario.push({
        vacio: false,
        numero: i,
        fechaCompleta: fechaDelDia,
        ocupado: estaOcupado,
        seleccionado: false,
      });
    }
  }

  cambiarMes(direccion: number) {
    this.mesActual.setMonth(this.mesActual.getMonth() + direccion);
    this.generarCalendario();
  }

  obtenerNombreMes() {
    return `${this.nombresMeses[this.mesActual.getMonth()]} ${this.mesActual.getFullYear()}`;
  }

  seleccionarFecha(dia: any) {
    if (dia.vacio || dia.ocupado) return;

    const fechaClic = dia.fechaCompleta;

    if (!this.fechaEntrada || (this.fechaEntrada && this.fechaSalida)) {
      this.fechaEntrada = fechaClic;
      this.fechaSalida = null;
    } else if (!this.fechaSalida && fechaClic > this.fechaEntrada) {
      this.fechaSalida = fechaClic;
    } else {
      this.fechaEntrada = fechaClic;
      this.fechaSalida = null;
    }
  }

  esFechaEntrada(fecha: Date): boolean {
    return this.fechaEntrada?.getTime() === fecha?.getTime();
  }

  esFechaSalida(fecha: Date): boolean {
    return this.fechaSalida?.getTime() === fecha?.getTime();
  }

  estaEnRango(fecha: Date): boolean {
    if (!this.fechaEntrada || !this.fechaSalida) return false;
    return fecha > this.fechaEntrada && fecha < this.fechaSalida;
  }

  enviarReserva() {
    if (!this.fechaEntrada || !this.fechaSalida) {
      alert('Selecciona las fechas de entrada y salida en el calendario.');
      return;
    }

    const reservaPayload = {
      id_propiedad: this.casa.id_propiedad,
      fecha_entrada: this.fechaEntrada.toISOString().split('T')[0],
      fecha_salida: this.fechaSalida.toISOString().split('T')[0],
      nombre: this.datosCliente.nombre,
      email: this.datosCliente.email,
      telefono: this.datosCliente.telefono,
      huespedes: this.datosCliente.huespedes,
    };

    this.propiedadService.crearReserva(reservaPayload).subscribe({
      next: (respuesta: any) => {
        if (respuesta.status === 'success') {

          this.mostrarModalExito = true;

          this.datosCliente = {
            nombre: '',
            email: '',
            telefono: '',
            huespedes: null,
          };
          this.fechaEntrada = null;
          this.fechaSalida = null;
          this.generarCalendario();
        } else {
          alert('Error: ' + respuesta.message);
        }
      },
      error: (err) => {
        console.error('Error enviando la reserva:', err);
        alert('Hubo un problema al conectar con el servidor.');
      },
    });
  }

  cerrarModalExito() {
    this.mostrarModalExito = false;
  }

}
