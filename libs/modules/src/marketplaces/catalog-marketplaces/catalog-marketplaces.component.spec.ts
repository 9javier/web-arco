import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMarketplacesComponent } from './catalog-marketplaces.component';

describe('CatalogMarketplacesComponent', () => {
  let component: CatalogMarketplacesComponent;
  let fixture: ComponentFixture<CatalogMarketplacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogMarketplacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogMarketplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
