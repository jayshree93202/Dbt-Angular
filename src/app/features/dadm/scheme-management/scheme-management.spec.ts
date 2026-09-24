import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeManagement } from './scheme-management';

describe('SchemeManagement', () => {
  let component: SchemeManagement;
  let fixture: ComponentFixture<SchemeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
