import { Project } from './project.model';
import { DateType } from './core.model';

export interface TaskAnalysis {
  taskUuid: string;
  taskTitle: string;
  initialCompletion: number;
  endCompletion: number;
}

export interface MilestoneAnalysis {
  milestoneUuid: string;
  milestoneTitle: string;
  startDate: DateType;
  endDate: DateType;
  initialCompletion: number;
  endCompletion: number;
  taskList: Array<TaskAnalysis>;
}

export interface ProjectAnalysis {
  project: Project;
  milestoneList: Array<MilestoneAnalysis>;
}
