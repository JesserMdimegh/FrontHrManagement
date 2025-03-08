import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-offers',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent {

  // State to toggle form visibility
  showJobForm: boolean = false;

  // Placeholder for job offers
  jobs = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Company XYZ',
      location: 'Remote',
      posted: '3 days ago',
      requiredSkills: 'HTML, CSS, JavaScript, React',
      candidates: []
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      company: 'Tech Solutions',
      location: 'On-site',
      posted: '1 week ago',
      requiredSkills: 'Node.js, Express, MongoDB',
      candidates: []
    },
    {
      id: 3,
      jobTitle: 'Data Analyst',
      company: 'DataCorp',
      location: 'Hybrid',
      posted: '2 weeks ago',
      requiredSkills: 'SQL, Python, Data Visualization',
      candidates: []
    }
  ];

  // Data model for new job offer
  newJob = {
    jobTitle: '',
    company: '',
    location: '',
    description: '',
    requiredSkills: '',
    interviewQuestions: ''
  };

  constructor(private router: Router) {}

  // Function to handle form submission and add new job
  addJobOffer() {
    // Automatically generate an ID for the new job (e.g., based on the length of jobs array + 1)
    const newJob = {
      ...this.newJob, // Spread the new job data
      id: this.jobs.length + 1, // Assign a unique ID based on the current length of jobs
      posted: 'Just Now', // You can also handle this dynamically
      candidates: [] // Initialize with empty candidates array
    };

    // Push the new job to the jobs array
    this.jobs.push(newJob);

    // Reset form and hide it
    this.resetForm();
    this.showJobForm = false;
  }

  // Function to reset form fields after adding a job
  resetForm() {
    this.newJob = {
      jobTitle: '',
      company: '',
      location: '',
      description: '',
      requiredSkills: '',
      interviewQuestions: ''
    };
  }

  // Function to handle viewing candidates
  viewCandidates(job: any) {
    console.log('Viewing candidates for:', job.jobTitle);
    this.router.navigate(['/condidates', job.id]);
  }

}
