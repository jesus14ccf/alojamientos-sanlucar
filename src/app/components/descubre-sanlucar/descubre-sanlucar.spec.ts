import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescubreSanlucar } from './descubre-sanlucar';

describe('DescubreSanlucar', () => {
  let component: DescubreSanlucar;
  let fixture: ComponentFixture<DescubreSanlucar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescubreSanlucar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescubreSanlucar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
