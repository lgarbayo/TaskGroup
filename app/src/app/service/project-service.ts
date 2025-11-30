import { inject, Injectable } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ValidatorFn } from '@angular/forms';
import { AddMemberCommand, Project, UpsertProjectCommand, UpsertProjectCommandForm } from '../model/project.model';
import { CoreService } from './core-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const trimmedRequired: ValidatorFn = (control) => {
  const value = (control.value ?? '') as string;
  return value.trim() ? null : { required: true };
};

const dateRangeValidator: ValidatorFn = (group) => {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (!start || !end) {
    return null;
  }
  const startValue = new Date(start.year, start.month, 1 + (start.week ?? 0) * 7);
  const endValue = new Date(end.year, end.month, 1 + (end.week ?? 0) * 7);
  return startValue <= endValue ? null : { dateRange: true };
};

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

  addMember(projectUuid: string, command: AddMemberCommand): Observable<Project> {
    return this.http
      .post<{ data: Project }>(`${this.resourceUrl}/${projectUuid}/members`, command)
      .pipe(map((response) => response.data));
  }

  projectForm(project?: Project): UpsertProjectCommandForm {
    return this.nfb.group({
      title: [project?.title ?? '', [trimmedRequired]],
      description: project?.description ?? '',
      startDate: this.coreService.dateTypeForm(project?.startDate),
      endDate: this.coreService.dateTypeForm(project?.endDate),
      additionalFields: this.additionalFieldsForm(project?.additionalFields ?? {}),
    }, { validators: dateRangeValidator });
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
