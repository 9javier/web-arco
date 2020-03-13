import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReviewComponent } from './modal-review.component';

describe('ReviewImagesComponent', () => {
  let component: ModalReviewComponent;
  let fixture: ComponentFixture<ModalReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
