import { TestBed } from '@angular/core/testing';

import { PrintTicketService } from './print-ticket.service';

describe('PrintTicketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintTicketService = TestBed.get(PrintTicketService);
    expect(service).toBeTruthy();
  });
});
