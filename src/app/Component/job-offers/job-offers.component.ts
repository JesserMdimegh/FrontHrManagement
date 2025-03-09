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

  
  showJobForm: boolean = false;

  
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
    const newJob = {
      ...this.newJob, 
      id: this.jobs.length + 1, 
      posted: 'Just Now', 
      candidates: [] 
    };

   
    this.jobs.push(newJob);

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
