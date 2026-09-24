import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScheme } from './add-scheme';

describe('AddScheme', () => {
  let component: AddScheme;
  let fixture: ComponentFixture<AddScheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScheme],
    }).compileComponents();

    fixture = TestBed.createComponent(AddScheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
