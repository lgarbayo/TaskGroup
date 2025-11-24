import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { ProjectService } from '../../service/project-service';
import { Project, UpsertProjectCommand } from '../../model/project.model';
import { RouterLink } from '@angular/router';
import { ProjectForm } from "../../component/project/project-form/project-form";
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-project-list-page',
  standalone: true,
  imports: [
    RouterLink,
    ProjectForm
],
  templateUrl: './project-list-page.html',
  styleUrl: './project-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListPage {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  @ViewChild(ProjectForm) projectFormComponent?: ProjectForm;

  projectList = signal<Array<Project>>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const token = this.authService.token();
      if (token) {
        this.loadProjects();
      } else {
        this.projectList.set([]);
        this.errorMessage.set(null);
      }
    });
  }

  loadProjects(): void {
    this.loading.set(true);
    this.projectService.list().subscribe({
      next: (projects) => {
        this.projectList.set(projects);
        this.errorMessage.set(null);
      },
      error: (error) => {
        console.error('Unable to fetch project list', error);
        this.errorMessage.set('We couldn\'t load the project list.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  createProject(command: UpsertProjectCommand): void {
    this.loading.set(true);
    this.projectService.createProject(command).subscribe({
      next: () => {
        this.projectFormComponent?.resetForm();
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creating project', error);
        this.errorMessage.set('We couldn\'t create the project.');
        this.loading.set(false);
      },
    });
  }

  deleteProject(projectUuid: string): void {
    this.loading.set(true);
    this.projectService.deleteProject(projectUuid).subscribe({
      next: () => this.loadProjects(),
      error: (error) => {
        console.error('Error deleting project', error);
        this.errorMessage.set('We couldn\'t delete the project.');
        this.loading.set(false);
      },
    });
  }

  trackProject(_: number, project: Project): string {
    return project.uuid;
  }
}
