import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { EmployeeService } from '../../../services/services';
import { EmployeDto } from '../../../services/models/employe-dto';
import { PerformanceReview } from '../../../services/models/performance-review.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-performance',
  templateUrl: './employee-performance.component.html',
  styleUrls: ['./employee-performance.component.css'],
  imports: [CommonModule],
})
export class EmployeePerformanceComponent implements OnInit {
  employeeId!: string;
  employee!: EmployeDto;
  performanceReviews: PerformanceReview[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  charts: Chart[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.loadEmployeeData();
    this.loadPerformanceReviews();
  }

  loadEmployeeData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.employeeService.getEmployee(this.employeeId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load employee data. Please try again later.';
          console.error('Error fetching employee:', error);
          return of(null);
        })
      )
      .subscribe(employee => {
        if (employee) {
          this.employee = {
            id: employee.Id,
            firstname: employee.Firstname,
            lastname: employee.Lastname,
            email: employee.Email,
            poste: employee.Poste,
            department: employee.Firstname
          } as EmployeDto;
        }
      });
  }

  loadPerformanceReviews(): void {
    this.employeeService.getPerformanceReviews(this.employeeId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load performance data. Please try again later.';
          console.error('Error fetching performance reviews:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(reviews => {
        this.performanceReviews = reviews;
        if (reviews.length > 0) {
          setTimeout(() => this.initCharts(), 100);
        } else {
          this.errorMessage = 'No performance data available for this employee.';
        }
      });
  }

  initCharts(): void {
    // Destroy existing charts to prevent memory leaks
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    // Get the latest performance review
    const latestReview = this.performanceReviews[0];
    const allReviews = [...this.performanceReviews].reverse(); // Oldest first for trends

    // Attendance Data
    const presentDays = 22 - latestReview.Absences; // Assuming 22 working days/month
    const absentDays = latestReview.Absences;

    // Task Performance Data
    const totalTasks = latestReview.TasksCompleted + Math.floor(latestReview.TasksCompleted * (1 - (latestReview.OnTimeCompletionRate / 100)));
    const completedOnTime = Math.floor(latestReview.TasksCompleted * (latestReview.OnTimeCompletionRate / 100));
    const completedLate = latestReview.TasksCompleted - completedOnTime;

    // Productivity Trend Data
    const productivityScores = allReviews.map(review => review.OverallScore);
    const productivityLabels = allReviews.map((_, index) => `Review ${index + 1}`);

    const clientSatisfactionScore = allReviews.map(review => review.ClientSatisfactionScore);
    const clientSatisfactionLabels = allReviews.map((_, index) => `Review ${index + 1}`);
    const trendChart = new Chart('trendChart', {
      type: 'line',
      data: {
        labels: clientSatisfactionLabels,
        datasets: [{
          label: 'Client Satisfaction',
          data: clientSatisfactionScore,
          borderColor: '#3F51B5',
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        scales: {
          y: { 
            min: 0, 
            max: 100,
            ticks: { callback: v => `${v}%` }
          }
        }
      }
    });

    // Attendance Chart
    this.charts.push(new Chart('attendanceChart', {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent','Late Arrivals'],
        datasets: [{
          data: [presentDays, absentDays, latestReview.LateArrivals],
          backgroundColor: ['#4e73df', '#e74a3b', '#f6c23e'],
          hoverBackgroundColor: ['#2e59d9', '#be2617', '#dda20a'],
          borderWidth: 1,
          borderColor: '#fff',
          hoverBorderColor: '#fff'

        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const value = context.raw as number;
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${value} days (${percentage}%)`;
              }
            }
          }
        }
      }
    }));

    // Task Performance Chart
    this.charts.push(new Chart('taskCompletionChart', {
      type: 'pie',
      data: {
        labels: ['On Time', 'Late', 'Not Completed'],
        datasets: [{
          data: [
            completedOnTime,
            completedLate,
            latestReview.ProcessImprovementIdeas // Using this as "not completed" for example
          ],
          backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
          hoverBackgroundColor: ['#17a673', '#dda20a', '#be2617'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const value = context.raw as number;
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${value} tasks (${percentage}%)`;
              }
            }
          }
        }
      }
    }));

    // Quality Rating Chart
    this.charts.push(new Chart('qualityRatingChart', {
      type: 'radar',
      data: {
        labels: ['Output Quality', 'Initiative', 'Communication', 'Process Improvement', 'Attendance'],
        datasets: [{
          label: 'Performance Scores',
          data: [
            latestReview.OutputQualityScore,
            latestReview.InitiativeScore,
            latestReview.CommunicationScore,
            latestReview.ProcessImprovementIdeas,
            10 - latestReview.Absences // Attendance score
          ],
          backgroundColor: 'rgba(78, 115, 223, 0.2)',
          borderColor: 'rgba(78, 115, 223, 1)',
          pointBackgroundColor: 'rgba(78, 115, 223, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 10
          }
        }
      }
    }));

    // Productivity Trend Chart
    this.charts.push(new Chart('productivityChart', {
      type: 'line',
      data: {
        labels: productivityLabels,
        datasets: [
          {
            label: 'Overall Performance',
            data: productivityScores,
            borderColor: '#4e73df',
            backgroundColor: 'transparent',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 10
          }
        }
      }
    }));

    // Skill Matrix Chart
    this.charts.push(new Chart('skillMatrixChart', {
      type: 'bar',
      data: {
        labels: ['Output Quality', 'Initiative', 'Communication'],
        datasets: [{
          label: 'Scores',
          data: [
            latestReview.OutputQualityScore,
            latestReview.InitiativeScore,
            latestReview.CommunicationScore
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    }));
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }
}