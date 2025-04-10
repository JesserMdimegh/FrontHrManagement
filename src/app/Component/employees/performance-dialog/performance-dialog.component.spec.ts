import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDialogComponent } from './performance-dialog.component';

describe('PerformanceDialogComponent', () => {
  let component: PerformanceDialogComponent;
  let fixture: ComponentFixture<PerformanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
