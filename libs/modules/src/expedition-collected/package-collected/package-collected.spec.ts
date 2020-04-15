import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCollectedComponent } from './package-collected.component';

describe('ProductsAvelonComponent', () => {
  let component: PackageCollectedComponent;
  let fixture: ComponentFixture<PackageCollectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageCollectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
