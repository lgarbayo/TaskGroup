import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { ProjectService } from '../../service/project-service';
import { Project, UpsertProjectCommand } from '../../model/project.model';
import { RouterLink } from '@angular/router';
import { ProjectForm } from "../../component/project/project-form/project-form";
import { AuthService } from '../../service/auth-service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { CoreService } from '../../service/core-service';

@Component({
  selector: 'app-project-list-page',
  standalone: true,
  imports: [
    RouterLink,
    ProjectForm,
    TranslatePipe
],
  templateUrl: './project-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListPage {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  protected core = inject(CoreService);
  @ViewChild(ProjectForm) projectFormComponent?: ProjectForm;

  projectList = signal<Array<Project>>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showCreateModal = signal(false);

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
        this.errorMessage.set('projects.error.list');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.projectFormComponent?.resetForm();
    this.showCreateModal.set(false);
  }

  createProject(command: UpsertProjectCommand): void {
    this.loading.set(true);
    this.projectService.createProject(command).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creating project', error);
        this.errorMessage.set('projects.error.create');
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
        this.errorMessage.set('projects.error.delete');
        this.loading.set(false);
      },
    });
  }

  trackProject(_: number, project: Project): string {
    return project.uuid;
  }
}
