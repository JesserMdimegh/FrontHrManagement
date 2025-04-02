import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApplicationDtoPost } from '../../services/models/application-dto-post';
import { apiJobOfferGet } from '../../services/fn/job-offer/api-job-offer-get';
import { apiApplicationApplyPost, ApiApplicationApplyPost$Params } from '../../services/fn/application/api-application-apply-post';
import { StrictHttpResponse } from '../../services/strict-http-response';
import { UserType } from '../../services/models/UserType';
import { TokenService } from '../../services/services/token.service';
import { JobOffer } from '../../services/models/job-offer';
import { JobOfferService } from '../../services/services';
import { LoginService } from '../../services/services/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  jobs: JobOffer[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  candidateId: string | null = null;
  selectedJob: JobOffer| null = null;
  cvFile: File | null = null;
  cvBase64: string | null = null;
  isLoggedIn: boolean = false;
  usertype: UserType | null = null;

  constructor(private http: HttpClient, private router: Router, private tokenservice: TokenService,private jobOfferService : JobOfferService,private loginService : LoginService) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.fetchJobOffers();

  }

  checkAuthStatus(): void {
    const token = this.tokenservice.token;
    const user = this.tokenservice.user;

    // Debugging: Decode and log the token payload
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log('No token found in localStorage');
    }
    this.usertype = user.UserType !== undefined ? user.UserType as UserType : null;
    this.candidateId = user.id || null;
    console.log('User type set to:', this.usertype);
    this.isLoggedIn = !!token && user !== null && this.usertype !== null;




  }

  fetchJobOffers(): void {

    this.isLoading = true;
    this.errorMessage = null;

    const rootUrl = 'http://localhost:5096';
    apiJobOfferGet(this.http, rootUrl).subscribe({
      next: (response: StrictHttpResponse<JobOffer[]>) => {
        this.jobs = response.body || [];
        console.log('Fetched job offers:', this.jobs);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load job offers: ' + (error.message || 'Unknown error');
        console.error('Error fetching job offers:', error);
      }
    });
  }

  startApplication(job: JobOffer): void {

    if (this.usertype !== UserType.CANDIDATE) {
      this.errorMessage = 'Only candidates can apply for job offers.';
      console.log('Restricted user type:', this.usertype);
      return;
    }

    this.selectedJob = job;
    this.cvFile = null;
    this.cvBase64 = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  onCvFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cvFile = input.files[0];
      this.convertFileToBase64(this.cvFile);
    }
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.cvBase64 = (reader.result as string).split(',')[1];
    };
    reader.onerror = () => {
      this.errorMessage = 'Failed to read the CV file. Please try again.';
    };
    reader.readAsDataURL(file);
  }

  applyForJob(): void {
    if (!this.candidateId) {
      this.errorMessage = 'You need to log in as a candidate to apply.';
      console.error('No candidate ID found. Please log in.');
      return;
    }

    if (!this.selectedJob || !this.selectedJob.Id) {
      this.errorMessage = 'Invalid job offer. Please select a job.';
      return;
    }

    if (!this.cvBase64) {
      this.errorMessage = 'Please upload a CV before applying.';
      return;
    }

    if (this.usertype !== UserType.CANDIDATE) {
      this.errorMessage = 'Only candidates can apply for job offers.';
      console.log('Restricted user type:', this.usertype);
      return;
    }

    const rootUrl = 'http://localhost:5096';
    const applicationDto: ApplicationDtoPost = {
      candidatId: this.candidateId,
      jobOfferId: this.selectedJob.Id,
      cv: this.cvBase64
    };

    console.log('Submitting application with data:', applicationDto);

    const params: ApiApplicationApplyPost$Params = { body: applicationDto };

    apiApplicationApplyPost(this.http, rootUrl, params).subscribe({
      next: (response: StrictHttpResponse<string>) => {
        const responseBody = JSON.parse(response.body);
        this.successMessage = responseBody.message || 'Application submitted successfully.';
        this.errorMessage = null;
        this.selectedJob = null;
        console.log('Application response:', responseBody);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to submit application: ' + (error.error?.message || error.message || 'Unknown error');
        this.successMessage = null;
        console.error('Application error details:', error);
        if (error.status === 403) {
          this.errorMessage = 'You are not authorized to apply. Ensure you are logged in as a candidate.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid application data. Please check your inputs.';
        }
      }
    });
  }

  cancelApplication(): void {
    this.selectedJob = null;
    this.cvFile = null;
    this.cvBase64 = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  logout(): void {
    this.loginService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear user data too
    this.candidateId = null;
    this.isLoggedIn = false;
    this.usertype = null;
    this.jobs = [];
    this.successMessage = 'Logged out successfully!';
    this.router.navigate(['/login']);

  }
}
