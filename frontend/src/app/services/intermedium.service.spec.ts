import { TestBed } from '@angular/core/testing';

import { IntermediumService } from './intermedium.service';

describe('IntermediumService', () => {
  let service: IntermediumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntermediumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
