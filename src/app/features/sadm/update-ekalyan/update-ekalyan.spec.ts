import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEkalyan } from './update-ekalyan';

describe('UpdateEkalyan', () => {
  let component: UpdateEkalyan;
  let fixture: ComponentFixture<UpdateEkalyan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEkalyan],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEkalyan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
