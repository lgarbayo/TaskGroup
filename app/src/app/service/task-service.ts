import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
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
    return this.http.get<Array<Task>>(`${this.projectUrl}/${projectUuid}/tasks`);
  }

  get(projectUuid: string, taskUuid: string): Observable<Task> {
    return this.http.get<Task>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}`);
  }

  create(projectUuid: string, command: UpsertTaskCommand): Observable<Task> {
    return this.http.post<Task>(`${this.projectUrl}/${projectUuid}/tasks`, this.mapToApiPayload(command));
  }

  update(projectUuid: string, taskUuid: string, command: UpsertTaskCommand): Observable<Task> {
    return this.http.put<Task>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}`, this.mapToApiPayload(command));
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
    });
  }

  private mapToApiPayload(command: UpsertTaskCommand) {
    return {
      title: command.title,
      description: command.description,
      duration_weeks: command.durationWeeks,
      start_date: command.startDate,
    };
  }
}
