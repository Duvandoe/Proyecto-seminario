import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosListaComponent } from './vehiculos-lista';

describe('VehiculosLista', () => {
  let component: VehiculosListaComponent;
  let fixture: ComponentFixture<VehiculosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
