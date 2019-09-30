import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterButtonsSorterComponent } from './matrix-input.component';

describe('FooterButtonsSorterComponent', () => {
  let component: FooterButtonsSorterComponent;
  let fixture: ComponentFixture<FooterButtonsSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterButtonsSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterButtonsSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
