import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { JobOfferService } from '../../services/services/job-offer.service';
import { apiApplicationOfferJobOfferIdCandidatesGet, ApiApplicationOfferJobOfferIdCandidatesGet$Params } from '../../services/fn/application/api-application-offer-job-offer-id-candidates-get';
import { CandidatDto } from '../../services/models/candidat-dto';
import { Competence } from '../../services/models/competence';
import { environment } from '../../services/environment';
import { CommonModule } from '@angular/common';
import { StrictHttpResponse } from '../../services/strict-http-response';
import { tap } from 'rxjs/operators';

interface JobOffer {
  id: string;
  posted: string;
  candidates: CandidatDto[];
  competences?: Competence[];
  description?: string;
  experience?: number;
  location?: string;
  salary?: number;
  title?: string;
  filteredCandidates?: CandidatDto[];
}

@Component({
  selector: 'app-job-offer-candidates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-offer-candidates.component.html',
  styleUrls: ['./job-offer-candidates.component.css']
})
export class JobOfferCandidatesComponent implements OnInit {
  job: JobOffer | null = null;
  loading: boolean = false;
  formErrors: string[] = [];
  currentSort: string = 'dateDesc';
  candidateCurrentPage: number = 1;
  candidatePageSize: number = 5;
  candidatePageSizeOptions: number[] = [5, 10, 20];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private jobOfferService: JobOfferService
  ) {}

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    console.log('Job ID from route:', jobId);
    if (jobId) {
      this.loadJobDetails(jobId).subscribe({
        next: () => {
          // Only load candidates after job details are loaded
          this.loadCandidates(jobId);
        },
        error: (error) => {
          console.error('Failed to load job details:', error);
          this.router.navigate(['/JobOffers']);
        }
      });
    } else {
      this.formErrors.push('Invalid job offer ID');
      this.router.navigate(['/JobOffers']);
    }
  }

  loadCandidates(jobId: string) {
    this.loading = true;
    const rootUrl = environment.apiUrl;
    console.log('API URL:', rootUrl);
    const params: ApiApplicationOfferJobOfferIdCandidatesGet$Params = { jobOfferId: jobId };
    console.log('Fetching candidates for job ID:', jobId);
    console.log('Authorization token:', localStorage.getItem('token'));
    
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const httpContext = new HttpContext();
    const httpHeaders = new HttpHeaders(headers || {});
    apiApplicationOfferJobOfferIdCandidatesGet(this.http, rootUrl, params, httpContext).subscribe({
      next: (response: StrictHttpResponse<CandidatDto[]>) => {
        console.log('Candidates response:', response);
        console.log('Candidates data:', response.body); // Add this log
        if (this.job) {
          this.job.candidates = response.body || [];
          this.job.filteredCandidates = [...this.job.candidates];
          console.log('Assigned candidates:', this.job.candidates);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error(`Error fetching candidates for job ${jobId}:`, error);
        this.formErrors.push('Failed to load candidates. Please try again.');
        this.loading = false;
      }
    });
  }
  loadJobDetails(jobId: string) {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
    return this.jobOfferService.apiJobOfferIdGet({ id: jobId }).pipe(
      tap({
        next: (response: any) => {
          console.log('Job details response:', response);
          const jobData = response.body || response;
          this.job = {
            id: jobData.Id || jobData.id || '',
            posted: jobData.Posted || jobData.posted || new Date().toISOString(),
            candidates: [],
            competences: jobData.Competences || jobData.competences || [],
            description: jobData.Description || jobData.description || '',
            experience: jobData.Experience || jobData.experience || 0,
            location: jobData.Location || jobData.location || '',
            salary: jobData.Salary || jobData.salary || 0,
            title: jobData.Title || jobData.title || ''
          };
          console.log('Job details loaded:', this.job);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading job details:', error);
          this.formErrors.push('Failed to load job details');
          this.loading = false;
          throw error;
        }
      })
    );
  }
  goBack() {
    this.router.navigate(['/JobOffers']); // Updated to match your route
  }

  paginatedCandidates(): CandidatDto[] { // Removed job parameter
    if (!this.job) return [];
    const candidates = this.job.filteredCandidates || this.job.candidates;
    const startIndex = (this.candidateCurrentPage - 1) * this.candidatePageSize;
    const endIndex = startIndex + this.candidatePageSize;
    return candidates.slice(startIndex, endIndex);
  }

  candidateTotalPages(): number { // Removed job parameter
    if (!this.job) return 0;
    const candidates = this.job.filteredCandidates || this.job.candidates;
    return Math.ceil(candidates.length / this.candidatePageSize);
  }

  goToCandidatePage(page: number) {
    if (page >= 1 && page <= this.candidateTotalPages()) {
      this.candidateCurrentPage = page;
    }
  }

  changeCandidatePageSize(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.candidatePageSize = +select.value;
    this.candidateCurrentPage = 1; // Reset to first page
  }

  getPageNumbers(): number[] {
    const totalPages = this.candidateTotalPages();
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.candidateCurrentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  filterCandidates(event: Event) {
    if (!this.job) return;
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.job.filteredCandidates = this.job.candidates.filter((candidate: CandidatDto) =>
      (candidate.Firstname?.toLowerCase().includes(query) || false) ||
      (candidate.Lastname?.toLowerCase().includes(query) || false) ||
      (candidate.Email?.toLowerCase().includes(query) || false)
    );
    this.candidateCurrentPage = 1;
  }

  sortCandidatesBy(sortOption: string) {
    this.currentSort = sortOption;
    if (!this.job) return;

    const candidates = this.job.filteredCandidates || this.job.candidates;
    candidates.sort((a: CandidatDto, b: CandidatDto) => {
      if (sortOption === 'nameAsc') {
        return (a.Firstname || '').localeCompare(b.Firstname || '');
      } else if (sortOption === 'nameDesc') {
        return (b.Firstname || '').localeCompare(a.Firstname || '');
      } else if (sortOption === 'dateAsc') {
        return new Date(a.AppliedDate || '').getTime() - new Date(b.AppliedDate || '').getTime();
      } else if (sortOption === 'dateDesc') {
        return new Date(b.AppliedDate || '').getTime() - new Date(a.AppliedDate || '').getTime();
      }
      return 0;
    });

    this.job.filteredCandidates = [...candidates];
    this.candidateCurrentPage = 1;
  }

  formatCompetences(competences: Competence[] | null | undefined): string {
    if (!competences || competences.length === 0) {
      return 'No competences specified.';
    }
    return competences.map(c => c.Titre || 'Unknown competence').join(', ');
  }

  getStatusClass(candidate: CandidatDto): string {
    const status = candidate.Status?.toLowerCase() || 'pending';
    switch (status) {
      case 'shortlisted':
        return 'status-shortlisted';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }
  
  shortlistCandidate(candidate: CandidatDto) {
    console.log(`Shortlisting candidate: ${candidate.Firstname} ${candidate.Lastname}`);
    candidate.Status = 'Shortlisted';
    this.formErrors.push(`Candidate ${candidate.Firstname} ${candidate.Lastname} shortlisted.`);
  }
  
  rejectCandidate(candidate: CandidatDto) {
    console.log(`Rejecting candidate: ${candidate.Firstname} ${candidate.Lastname}`);
    candidate.Status = 'Rejected';
    this.formErrors.push(`Candidate ${candidate.Firstname} ${candidate.Lastname} rejected.`);
  }

  viewCv(cvUrl: string) {
    if (!cvUrl) {
      this.formErrors.push('No CV available for this candidate.');
      return;
    }
  
    const link = document.createElement('a');
    link.href = cvUrl;
    link.target = '_blank';
    link.download = ''; // Optional: triggers a download instead of opening
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

 
}