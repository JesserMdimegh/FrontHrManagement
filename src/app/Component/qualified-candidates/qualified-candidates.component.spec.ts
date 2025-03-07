import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifiedCandidatesComponent } from './qualified-candidates.component';

describe('QualifiedCandidatesComponent', () => {
  let component: QualifiedCandidatesComponent;
  let fixture: ComponentFixture<QualifiedCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualifiedCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualifiedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
