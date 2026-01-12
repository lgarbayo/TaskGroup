import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskComment, UpsertTaskCommentCommand } from '../model/task-comment.model';

@Injectable({
  providedIn: 'root',
})
export class TaskCommentService {
  private readonly projectUrl = '/api/projects';
  private http = inject(HttpClient);

  list(projectUuid: string, taskUuid: string): Observable<Array<TaskComment>> {
    return this.http
      .get<{ data: Array<TaskComment> }>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}/comments`)
      .pipe(map((response) => response.data ?? []));
  }

  create(projectUuid: string, taskUuid: string, command: UpsertTaskCommentCommand): Observable<TaskComment> {
    return this.http
      .post<{ data: TaskComment }>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}/comments`, command)
      .pipe(map((response) => response.data));
  }

  update(
    projectUuid: string,
    taskUuid: string,
    commentId: number,
    command: UpsertTaskCommentCommand
  ): Observable<TaskComment> {
    return this.http
      .put<{ data: TaskComment }>(
        `${this.projectUrl}/${projectUuid}/tasks/${taskUuid}/comments/${commentId}`,
        command
      )
      .pipe(map((response) => response.data));
  }

  delete(projectUuid: string, taskUuid: string, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.projectUrl}/${projectUuid}/tasks/${taskUuid}/comments/${commentId}`);
  }
}
