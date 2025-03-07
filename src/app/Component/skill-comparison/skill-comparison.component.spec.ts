import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillComparisonComponent } from './skill-comparison.component';

describe('SkillComparisonComponent', () => {
  let component: SkillComparisonComponent;
  let fixture: ComponentFixture<SkillComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
