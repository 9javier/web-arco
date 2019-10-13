import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterTemplateSelectionComponent } from './template';

describe('SorterTemplateSelectionComponent', () => {
  let component: SorterTemplateSelectionComponent;
  let fixture: ComponentFixture<SorterTemplateSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterTemplateSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterTemplateSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
