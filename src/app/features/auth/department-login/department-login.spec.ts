import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentLogin } from './department-login';

describe('DepartmentLogin', () => {
  let component: DepartmentLogin;
  let fixture: ComponentFixture<DepartmentLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
