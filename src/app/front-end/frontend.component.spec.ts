import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent, SidebarComponent } from '../shared';
import { AdminsComponent } from './frontend.component';

describe('AdminsComponent', () => {
  let component: AdminsComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      NgbDropdownModule.forRoot(),
      TranslateModule.forRoot(),
    ],
      declarations: [
        AdminsComponent,
        HeaderComponent,
        SidebarComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
