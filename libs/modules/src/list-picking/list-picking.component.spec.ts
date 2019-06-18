import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPickingComponent } from './list-picking.component';

describe('ListPickingComponent', () => {
  let component: ListPickingComponent;
  let fixture: ComponentFixture<ListPickingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPickingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
