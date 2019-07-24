import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWarehousePickingComponent } from './group-warehouse-picking.component';

describe('GroupWarehousePickingComponent', () => {
  let component: GroupWarehousePickingComponent;
  let fixture: ComponentFixture<GroupWarehousePickingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWarehousePickingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWarehousePickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
