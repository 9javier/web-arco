import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasProductosComponent } from './listas-productos.component';

describe('ListasProductosComponent', () => {
  let component: ListasProductosComponent;
  let fixture: ComponentFixture<ListasProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
