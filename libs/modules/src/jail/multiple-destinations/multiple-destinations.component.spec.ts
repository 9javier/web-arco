import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDestinationsComponent } from './multiple-destinations.component';

describe('MultipleDestinationsComponent', () => {
  let component: MultipleDestinationsComponent;
  let fixture: ComponentFixture<MultipleDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
