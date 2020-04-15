import { TestBed } from '@angular/core/testing';
import { CameraProvider } from './camera.provider';

describe('DefectCameraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CameraProvider = TestBed.get(CameraProvider);
    expect(service).toBeTruthy();
  });
});
