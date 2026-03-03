import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleApartamento } from './detalle-apartamento';

describe('DetalleApartamento', () => {
  let component: DetalleApartamento;
  let fixture: ComponentFixture<DetalleApartamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleApartamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleApartamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
