import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalleLista } from './calle-lista';

describe('CalleLista', () => {
  let component: CalleLista;
  let fixture: ComponentFixture<CalleLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalleLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalleLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
