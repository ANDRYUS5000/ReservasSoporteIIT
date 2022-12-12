import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarespaciosComponent } from './gestionarespacios.component';

describe('GestionarespaciosComponent', () => {
  let component: GestionarespaciosComponent;
  let fixture: ComponentFixture<GestionarespaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionarespaciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarespaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
