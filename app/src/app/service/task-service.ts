import { inject, Injectable } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Task, UpsertTaskCommand, UpsertTaskCommandForm } from '../model/task.model';
import { CoreService } from './core-service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly projectUrl = '/api/projects';
  private http = inject(HttpClient);
  private nfb = inject(NonNullableFormBuilder);
  private coreService = inject(CoreService);

  list(projectUuid: string): Observable<Array<Task>> {
    return this.http
      .get<{ data: Array<Task> }>(`${this.projectUrl}/${projectUuid}/tasks`)
      .pipe(map((response) => response.data ?? []));
  }

  get(projectUuid: string, taskUuid: string): Observable<Task> {
    return this.http
      .get<{ data: Task }>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}`)
      .pipe(map((response) => response.data));
  }

  create(projectUuid: string, command: UpsertTaskCommand): Observable<Task> {
    return this.http
      .post<{ data: Task }>(`${this.projectUrl}/${projectUuid}/tasks`, this.mapToApiPayload(command))
      .pipe(map((response) => response.data));
  }

  update(projectUuid: string, taskUuid: string, command: UpsertTaskCommand): Observable<Task> {
    return this.http
      .put<{ data: Task }>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}`, this.mapToApiPayload(command))
      .pipe(map((response) => response.data));
  }

  delete(projectUuid: string, taskUuid: string): Observable<void> {
    return this.http.delete<void>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}`);
  }

  form(task?: Task): UpsertTaskCommandForm {
    return this.nfb.group({
      title: [task?.title ?? '', [Validators.required]],
      description: task?.description ?? '',
      durationWeeks: [task?.durationWeeks ?? 1, [Validators.required]],
      startDate: this.coreService.dateTypeForm(task?.startDate),
      status: [task?.status ?? 'pending', [Validators.required]],
      assigneeId: new FormControl<number | null>(task?.assignee?.id ?? null),
      milestoneUuid: new FormControl<string | null>(task?.milestone?.uuid ?? null),
    });
  }

  private mapToApiPayload(command: UpsertTaskCommand) {
    return {
      title: command.title,
      description: command.description,
      duration_weeks: command.durationWeeks,
      start_date: command.startDate,
      status: command.status,
      assignee_id: command.assigneeId ?? null,
      milestone_uuid: command.milestoneUuid ?? null,
    };
  }
}
