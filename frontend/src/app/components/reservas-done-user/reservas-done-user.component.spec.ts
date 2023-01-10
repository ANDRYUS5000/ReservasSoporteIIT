import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasDoneUserComponent } from './reservas-done-user.component';

describe('ReservasDoneUserComponent', () => {
  let component: ReservasDoneUserComponent;
  let fixture: ComponentFixture<ReservasDoneUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservasDoneUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasDoneUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
