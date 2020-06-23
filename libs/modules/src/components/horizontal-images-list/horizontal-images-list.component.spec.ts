import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalImagesListComponent } from './horizontal-images-list.component';

describe('HorizontalImagesListComponent', () => {
  let component: HorizontalImagesListComponent;
  let fixture: ComponentFixture<HorizontalImagesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalImagesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalImagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
