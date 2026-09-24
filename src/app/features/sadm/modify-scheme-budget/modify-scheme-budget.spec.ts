import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySchemeBudget } from './modify-scheme-budget';

describe('ModifySchemeBudget', () => {
  let component: ModifySchemeBudget;
  let fixture: ComponentFixture<ModifySchemeBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifySchemeBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifySchemeBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
