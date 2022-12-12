import { TestBed } from '@angular/core/testing';

import { ReservasAdminService } from './reservas-admin.service';

describe('ReservasAdminService', () => {
  let service: ReservasAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
