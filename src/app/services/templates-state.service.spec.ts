import { TestBed } from '@angular/core/testing';

import { TemplatesStateService } from './templates-state.service';

describe('TemplatesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplatesStateService = TestBed.get(TemplatesStateService);
    expect(service).toBeTruthy();
  });
});
