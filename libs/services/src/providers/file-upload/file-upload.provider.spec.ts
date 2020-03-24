import { TestBed } from '@angular/core/testing';
import { FileUploadProvider } from './file-upload.provider';


describe('FileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileUploadProvider = TestBed.get(FileUploadProvider);
    expect(service).toBeTruthy();
  });
});
