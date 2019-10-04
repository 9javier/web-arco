import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorItemSorterComponent } from './color.component';

describe('ColorItemSorterComponent', () => {
  let component: ColorItemSorterComponent;
  let fixture: ComponentFixture<ColorItemSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorItemSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorItemSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
