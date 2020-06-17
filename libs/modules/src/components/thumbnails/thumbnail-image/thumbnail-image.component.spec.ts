import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailImageComponent } from './thumbnail-image.component';

describe('ThumbnailImageComponent', () => {
  let component: ThumbnailImageComponent;
  let fixture: ComponentFixture<ThumbnailImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
