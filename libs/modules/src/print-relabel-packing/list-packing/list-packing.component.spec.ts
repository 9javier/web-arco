import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPackingRelabelTemplateComponent } from './list-packing.component';

describe('ListPackingRelabelTemplateComponent', () => {
  let component: ListPackingRelabelTemplateComponent;
  let fixture: ComponentFixture<ListPackingRelabelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPackingRelabelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPackingRelabelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
