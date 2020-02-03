import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDestinationsComponent } from './show-destinations.component';

describe('ShowDestinationsComponent', () => {
  let component: ShowDestinationsComponent;
  let fixture: ComponentFixture<ShowDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
