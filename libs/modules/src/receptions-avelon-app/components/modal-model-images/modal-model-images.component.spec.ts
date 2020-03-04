import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModelImagesComponent } from './modal-model-images.component';

describe('ModalModelImagesComponent', () => {
  let component: ModalModelImagesComponent;
  let fixture: ComponentFixture<ModalModelImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalModelImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalModelImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
