import { TestBed } from '@angular/core/testing';

import { Recoleccion } from './recoleccion';

describe('Recoleccion', () => {
  let service: Recoleccion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recoleccion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
