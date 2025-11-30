import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Milestone, UpsertMilestoneCommand, UpsertMilestoneCommandForm } from '../model/milestone.model';
import { CoreService } from './core-service';

const trimmedRequired: ValidatorFn = (control) => {
  const value = (control.value ?? '') as string;
  return value.trim() ? null : { required: true };
};

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private readonly projectUrl = '/api/projects';
  private http = inject(HttpClient);
  private nfb = inject(NonNullableFormBuilder);
  private coreService = inject(CoreService);

  list(projectUuid: string): Observable<Array<Milestone>> {
    return this.http
      .get<{ data: Array<Milestone> }>(`${this.projectUrl}/${projectUuid}/milestone`)
      .pipe(map((response) => response.data ?? []));
  }

  get(projectUuid: string, milestoneUuid: string): Observable<Milestone> {
    return this.http
      .get<{ data: Milestone }>(`${this.projectUrl}/${projectUuid}/milestone/${milestoneUuid}`)
      .pipe(map((response) => response.data));
  }

  create(projectUuid: string, command: UpsertMilestoneCommand): Observable<Milestone> {
    return this.http
      .post<{ data: Milestone }>(`${this.projectUrl}/${projectUuid}/milestone`, command)
      .pipe(map((response) => response.data));
  }

  update(
    projectUuid: string,
    milestoneUuid: string,
    command: UpsertMilestoneCommand
  ): Observable<Milestone> {
    return this.http
      .put<{ data: Milestone }>(
        `${this.projectUrl}/${projectUuid}/milestone/${milestoneUuid}`,
        command
      )
      .pipe(map((response) => response.data));
  }

  delete(projectUuid: string, milestoneUuid: string): Observable<void> {
    return this.http.delete<void>(`${this.projectUrl}/${projectUuid}/milestone/${milestoneUuid}`);
  }

  form(milestone?: Milestone): UpsertMilestoneCommandForm {
    return this.nfb.group({
      title: [milestone?.title ?? '', [trimmedRequired]],
      description: milestone?.description ?? '',
      date: this.coreService.dateTypeForm(milestone?.date),
    });
  }
}
