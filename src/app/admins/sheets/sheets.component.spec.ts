import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsComponent } from './sheets.component';

describe('SheetsComponent', () => {
  let component: SheetsComponent;
  let fixture: ComponentFixture<SheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
