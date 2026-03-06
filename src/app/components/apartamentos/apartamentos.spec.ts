import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apartamentos } from './apartamentos';

describe('Apartamentos', () => {
  let component: Apartamentos;
  let fixture: ComponentFixture<Apartamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apartamentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Apartamentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
