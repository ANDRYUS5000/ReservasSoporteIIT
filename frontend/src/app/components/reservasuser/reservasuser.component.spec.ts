import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasuserComponent } from './reservasuser.component';

describe('ReservasuserComponent', () => {
  let component: ReservasuserComponent;
  let fixture: ComponentFixture<ReservasuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservasuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
