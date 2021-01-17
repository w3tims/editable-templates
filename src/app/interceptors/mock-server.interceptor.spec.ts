import { TestBed } from '@angular/core/testing';

import { MockServerInterceptor } from './mock-server.interceptor';

describe('MockServer.InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockServerInterceptor = TestBed.get(MockServerInterceptor);
    expect(service).toBeTruthy();
  });
});
