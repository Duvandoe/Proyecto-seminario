import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosRegistro } from './vehiculos-registro';

describe('VehiculosRegistro', () => {
  let component: VehiculosRegistro;
  let fixture: ComponentFixture<VehiculosRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
