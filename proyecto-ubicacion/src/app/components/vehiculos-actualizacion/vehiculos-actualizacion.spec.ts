import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosActualizacion } from './vehiculos-actualizacion';

describe('VehiculosActualizacion', () => {
  let component: VehiculosActualizacion;
  let fixture: ComponentFixture<VehiculosActualizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosActualizacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosActualizacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
