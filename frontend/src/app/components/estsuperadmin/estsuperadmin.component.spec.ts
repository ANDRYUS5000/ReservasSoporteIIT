import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstsuperadminComponent } from './estsuperadmin.component';

describe('EstsuperadminComponent', () => {
  let component: EstsuperadminComponent;
  let fixture: ComponentFixture<EstsuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstsuperadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstsuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
