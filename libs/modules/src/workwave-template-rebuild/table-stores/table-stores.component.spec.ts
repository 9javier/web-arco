import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStoresComponent } from './table-stores.component';

describe('TableStoresComponent', () => {
  let component: TableStoresComponent;
  let fixture: ComponentFixture<TableStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
