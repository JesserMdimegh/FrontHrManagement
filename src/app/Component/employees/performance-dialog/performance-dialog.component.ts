import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeDto } from '../../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-performance-dialog',
  templateUrl: './performance-dialog.component.html',
  styleUrls: ['./performance-dialog.component.scss'],
   imports: [MatCardModule,
      MatIconModule,
      MatPaginatorModule,
      MatTableModule,
      MatButtonModule,MatCardModule,
      MatIconModule,
      MatPaginatorModule,
      MatTableModule,
      MatButtonModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatSnackBarModule,
      MatSliderModule,]
})
export class performanceDialogComponent implements OnInit {
  performanceForm: FormGroup;
  employee: EmployeDto;
  reviews: any[] = [];

  // Chart.js configuration
  public performanceData: ChartConfiguration['data'] = {
    labels: ['Productivity', 'Teamwork', 'Communication', 'Punctuality', 'Quality'],
    datasets: [
      {
        data: [4, 3.5, 4.2, 4.5, 4],
        label: 'Performance',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
        fill: true
      }
    ]
  };

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    }
  };

  public radarChartType: ChartType = 'radar';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<performanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: EmployeDto },
    private snackBar: MatSnackBar
  ) {
    this.employee = data.employee;
    this.performanceForm = this.fb.group({
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['', Validators.required],
      date: [new Date(), Validators.required]
    });

    // Mock data - replace with actual API calls
    this.reviews = [
      {
        date: new Date('2023-01-15'),
        reviewer: 'Manager 1',
        rating: 4,
        comments: 'Excellent work this quarter'
      },
      {
        date: new Date('2022-10-10'),
        reviewer: 'Manager 2',
        rating: 3.5,
        comments: 'Good performance but room for improvement in communication'
      }
    ];
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // ... rest of the component remains the same ...
}