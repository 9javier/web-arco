import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBrandComponent } from './new-brand.component';

describe('ShowDestinationsComponent', () => {
  let component: NewBrandComponent;
  let fixture: ComponentFixture<NewBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
