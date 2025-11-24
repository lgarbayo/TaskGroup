import { inject, Injectable } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Project, UpsertProjectCommand, UpsertProjectCommandForm } from '../model/project.model';
import { CoreService } from './core-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly resourceUrl = '/api/projects';
  private nfb = inject(NonNullableFormBuilder);
  private coreService = inject(CoreService);
  private http = inject(HttpClient);

  list(): Observable<Array<Project>> {
    return this.http
      .get<{ data: Array<Project> }>(this.resourceUrl)
      .pipe(map((response) => response.data ?? []));
  }

  get(projectUuid: string): Observable<Project> {
    return this.http
      .get<{ data: Project }>(`${this.resourceUrl}/${projectUuid}`)
      .pipe(map((response) => response.data));
  }

  createProject(command: UpsertProjectCommand): Observable<Project> {
    return this.http
      .post<{ data: Project }>(this.resourceUrl, this.mapToApiPayload(command))
      .pipe(map((response) => response.data));
  }

  updateProject(projectUuid: string, command: UpsertProjectCommand): Observable<Project> {
    return this.http
      .put<{ data: Project }>(`${this.resourceUrl}/${projectUuid}`, this.mapToApiPayload(command))
      .pipe(map((response) => response.data));
  }

  deleteProject(projectUuid: string): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${projectUuid}`);
  }

  projectForm(project?: Project): UpsertProjectCommandForm {
    return this.nfb.group({
      title: [project?.title ?? '', [Validators.required]],
      description: project?.description ?? '',
      startDate: this.coreService.dateTypeForm(project?.startDate),
      endDate: this.coreService.dateTypeForm(project?.endDate),
      additionalFields: this.additionalFieldsForm(project?.additionalFields ?? {}),
    });
  }

  private additionalFieldsForm(additionalFields: Record<string, string>) {
    return this.nfb.record(
      Object.entries(additionalFields).reduce((acc, [key, value]) => {
        acc[key] = this.nfb.control(value ?? '');
        return acc;
      }, {} as { [key: string]: FormControl<string> })
    );
  }

  private mapToApiPayload(command: UpsertProjectCommand) {
    return {
      title: command.title,
      description: command.description,
      start_date: command.startDate,
      end_date: command.endDate,
      additional_fields: command.additionalFields,
    };
  }
}
