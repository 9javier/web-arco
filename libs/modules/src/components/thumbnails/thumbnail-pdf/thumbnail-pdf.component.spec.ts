import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailPdfComponent } from './thumbnail-pdf.component';

describe('ThumbnailPdfComponent', () => {
  let component: ThumbnailPdfComponent;
  let fixture: ComponentFixture<ThumbnailPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
