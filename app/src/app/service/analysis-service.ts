import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectAnalysis } from '../model/analysis.model';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private readonly projectUrl = '/api/projects';
  private http = inject(HttpClient);

  projectAnalysis(projectUuid: string): Observable<ProjectAnalysis> {
    return this.http
      .get<{ data: ProjectAnalysis }>(`${this.projectUrl}/${projectUuid}/analysis`)
      .pipe(map((response) => response.data));
  }
}
