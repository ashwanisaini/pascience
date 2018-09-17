import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFiltersComponent } from './data-filters.component';

describe('DataFiltersComponent', () => {
  let component: DataFiltersComponent;
  let fixture: ComponentFixture<DataFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
