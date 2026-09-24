import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { EncryptionService } from './encryptions';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
