import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewImagesComponent } from './review-images.component';

describe('ReviewImagesComponent', () => {
  let component: ReviewImagesComponent;
  let fixture: ComponentFixture<ReviewImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
