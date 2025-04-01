import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/services/job-offer.service';
import { JobOfferDtoCreate } from '../../services/models/job-offer-dto-create';
import { Competence } from '../../services/models/competence';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CompetenceService } from '../../services/services';
import { HttpClient } from '@angular/common/http';
import { apiApplicationOfferJobOfferIdCandidatesGet, ApiApplicationOfferJobOfferIdCandidatesGet$Params } from '../../services/fn/application/api-application-offer-job-offer-id-candidates-get';
import { CandidatDto } from '../../services/models/candidat-dto';

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {
  showJobForm: boolean = false;
  loading: boolean = false;
  jobs: Array<{
    id: string;
    posted: string;
    candidates: CandidatDto[];
    competences?: Competence[];
    description?: string;
    experience?: number;
    location?: string;
    salary?: number;
    title?: string;
  }> = [];
  filteredJobs: Array<any> = [];
  newJobForm: FormGroup;
  competencesList: Competence[] = [];
  selectedJobId: string | null = null;
  searchQuery: string = '';
  sortOption: string = 'newest';
  formErrors: string[] = [];
  isEditing: boolean = false;
  competences: Competence[] = [];

  constructor(
    private router: Router,
    private jobOfferService: JobOfferService,
    private competenceService: CompetenceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.newJobForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      experience: [0, Validators.required],
      salary: [0, Validators.required],
      competences: [[]]
    });


  }

  ngOnInit() {
    this.loadCompetences();
    this.loadJobs();
  }

  loadCompetences() {
    this.route.data.subscribe(data => {
      if (data['competences']) {
        this.competences = data['competences'];
      } else {
        console.error('No competences data found in route');
      }
    });
  }

  loadJobs() {
    this.loading = true;
    this.jobOfferService.apiJobOfferGet().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.jobs = response.map(job => ({
            ...job,
            candidates: []
          }));
          this.filteredJobs = [...this.jobs];
          this.sortJobs();
        } else {
          this.formErrors.push('Invalid jobs data format');
          this.jobs = [];
          this.filteredJobs = [];
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading jobs:', error);
        this.formErrors.push('Failed to load job offers');
        this.loading = false;
      }
    );
  }

  onCompetenceSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const competenceId = select.value;
    const competences = this.newJobForm.get('competences') as FormArray;
    if (!competences.value.includes(competenceId)) {
      competences.push(this.fb.control(competenceId));
    }
  }

  addJobOffer() {
    if (this.newJobForm.invalid) {
      console.error('Please fill in all required fields.');
      return;
    }

    const jobOfferData: JobOfferDtoCreate = {
      Title: this.newJobForm.value.title,
      Location: this.newJobForm.value.location,
      Description: this.newJobForm.value.description,
      Experience: this.newJobForm.value.experience,
      Salary: this.newJobForm.value.salary,
      Competences: this.newJobForm.value.competences
    }
    console.log('Job offer data:', jobOfferData);

    this.jobOfferService.apiJobOfferCreatePost({ body: jobOfferData }).subscribe({
      next:(response:any) => {
        console.log('Job offer created successfully:', response);
        this.resetForm();
        this.loadJobs();
      },
      error : (error) => {
        console.error('Error creating job offer:', error);
        this.formErrors.push('Failed to create job offer');
      }
    })
  }

  resetForm() {
    this.newJobForm.reset();
    const competences = this.newJobForm.get('competences') as FormArray;
    //competences.clear();
    this.formErrors = [];
    this.isEditing = false;
  }

  viewCandidates(job: any) {
    if (this.selectedJobId === job.id) {
      this.selectedJobId = null;
      return;
    }

    this.selectedJobId = job.id;
    this.loading = true;
    const rootUrl = 'http://localhost:5096';
    const params: ApiApplicationOfferJobOfferIdCandidatesGet$Params = {
      jobOfferId: job.id
    };

    apiApplicationOfferJobOfferIdCandidatesGet(this.http, rootUrl, params).subscribe(
      (response) => {
        job.candidates = response.body || [];
        this.loading = false;
      },
      (error) => {
        console.error(`Error fetching candidates for job ${job.id}:`, error);
        job.candidates = [];
        this.formErrors.push('Failed to load candidates');
        this.loading = false;
      }
    );
  }

  updateJob(job: any) {
    this.loading = true;
    this.jobOfferService.apiJobOfferIdGet({ id: job.id.toString() }).subscribe(
      (response: any) => {
        const jobData: JobOfferDtoCreate = response.body;
        this.newJobForm.patchValue({
          title: jobData.Title,
          location: jobData.Location,
          description: jobData.Description
        });

        const competences = this.newJobForm.get('competences') as FormArray;
        competences.clear();
        if (jobData.Competences && jobData.Competences.length > 0) {
          jobData.Competences.forEach((competence: Competence) => {
            competences.push(this.fb.control(competence.Id));
          });
        }

        this.showJobForm = true;
        this.isEditing = true;
        this.loading = false;
      },
      error => {
        console.error('Error fetching job details', error);
        this.formErrors.push('Failed to load job details');
        this.loading = false;
      }
    );
  }

  deleteJob(job: any) {
    if (confirm('Are you sure you want to delete this job offer?')) {
      this.loading = true;
      this.jobOfferService.apiJobOfferIdDelete({ id: job.id.toString() }).subscribe(
        () => {
          this.loadJobs();
        },
        error => {
          console.error('Error deleting job offer:', error);
          this.formErrors.push('Failed to delete job offer');
          this.loading = false;
        }
      );
    }
  }

  filterJobs(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (job.title?.toLowerCase().includes(this.searchQuery) || false) ||
      (job.location?.toLowerCase().includes(this.searchQuery) || false) ||
      (job.description?.toLowerCase().includes(this.searchQuery) || false)
    );
    this.sortJobs();
  }

  sortJobs(event?: Event) {
    if (event) {
      const select = event.target as HTMLSelectElement;
      this.sortOption = select.value;
    }

    this.filteredJobs.sort((a, b) => {
      const dateA = new Date(a.posted).getTime();
      const dateB = new Date(b.posted).getTime();
      return this.sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }
}
