import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReviewReturnComponent } from './modal-review-return.component';

describe('ReviewImagesComponent', () => {
  let component: ModalReviewReturnComponent;
  let fixture: ComponentFixture<ModalReviewReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReviewReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReviewReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
