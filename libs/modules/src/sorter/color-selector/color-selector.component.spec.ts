import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectorSorterComponent } from './color-selector.component';

describe('ColorSelectorSorterComponent', () => {
  let component: ColorSelectorSorterComponent;
  let fixture: ComponentFixture<ColorSelectorSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSelectorSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSelectorSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
