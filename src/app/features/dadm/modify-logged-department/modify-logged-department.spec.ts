import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyLoggedDepartment } from './modify-logged-department';

describe('ModifyLoggedDepartment', () => {
  let component: ModifyLoggedDepartment;
  let fixture: ComponentFixture<ModifyLoggedDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyLoggedDepartment],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyLoggedDepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
