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
import { ApplicationService, JobOfferService } from '../../services/services';
import { LoginService } from '../../services/services/login.service';
import { ChatbotComponent } from "../shared/chatbot/chatbot.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  chatbotStatus = true;
  toggleChatbot() {
    alert('Button clicked!'); // Simple test

    this.chatbotStatus = !this.chatbotStatus;
  }
  jobs: JobOffer[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  candidateId: string | null = null;
  selectedJob: JobOffer| null = null;
  cvFile: File | null = null;
  isLoggedIn: boolean = false;
  usertype: UserType | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenservice: TokenService,
    private jobOfferService : JobOfferService,
    private loginService : LoginService,
    private applicationService:ApplicationService
  )
  {}

  ngOnInit(): void {
    
    this.fetchJobOffers();
    this.candidateId = localStorage.getItem('candidateId') ;
    this.usertype = this.tokenservice.user.UserType as UserType;
    console.log(this.tokenservice.user.UserType )
    console.log('User type:', this.usertype);
  }



  fetchJobOffers(): void {

    this.isLoading = true;
    this.errorMessage = null;

    this.jobOfferService.apiJobOfferGet(this.http).subscribe({
      next: (response: JobOffer[]) => {
        this.jobs = response || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load job offers: ' + (error.message || 'Unknown error');
      }
    });
  }

  startApplication(job: JobOffer): void {
    this.selectedJob = job;
    this.cvFile = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  onCvFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // PDF only
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        input.value = '';
        return;
      }
      this.cvFile = input.files[0];
    }
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

    if (!this.cvFile) {
      this.errorMessage = 'Please upload a CV before applying.';
      return;
    }

    if (this.usertype !== UserType.CANDIDATE) {
      this.errorMessage = 'Only candidates can apply for job offers.';
      console.log('Restricted user type:', this.usertype);
      return;
    }

    

    const applicationDto: ApplicationDtoPost = {
      CandidatId: this.candidateId,
      JobOfferId: this.selectedJob.Id.toString(),
      Cv: this.cvFile
    };


    console.log('Submitting application with data:', applicationDto);


    this.applicationService.apiApplicationApplyPost({ body: applicationDto }).subscribe({
      next: (response: string) => {
        const responseBody = JSON.parse(response);
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
