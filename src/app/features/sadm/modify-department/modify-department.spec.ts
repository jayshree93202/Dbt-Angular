import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDepartment } from './modify-department';

describe('ModifyDepartment', () => {
  let component: ModifyDepartment;
  let fixture: ComponentFixture<ModifyDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyDepartment],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyDepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
