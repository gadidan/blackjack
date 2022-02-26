import { TestBed } from '@angular/core/testing';

import { CheatersService } from './cheaters.service';

describe('CheatersService', () => {
  let service: CheatersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheatersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
