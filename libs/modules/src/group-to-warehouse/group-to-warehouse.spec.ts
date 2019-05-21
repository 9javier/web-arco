import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupToWarehouseComponent } from './group-to-warehouse.component';

describe('GroupToWarehouseComponent', () => {
  let component: GroupToWarehouseComponent;
  let fixture: ComponentFixture<GroupToWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupToWarehouseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupToWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
