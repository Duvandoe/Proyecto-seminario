import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasMapaComponent } from './rutas-lista';

describe('RutasMapaComponent', () => {
  let component: RutasMapaComponent;
  let fixture: ComponentFixture<RutasMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutasMapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
