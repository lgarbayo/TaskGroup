import { FormControl, FormGroup, FormRecord } from "@angular/forms";
import { DateType, DateTypeForm } from "./core.model";

export interface Task {
  uuid: string;
  projectUuid: string;
  title: string;
  description?: string;
  durationWeeks: number;
  startDate: DateType;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TaskAssignee | null;
  assignees?: Array<TaskAssignee>;
  milestone?: TaskMilestone | null;
}

export type TaskStatus = 'pending' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskAssignee {
  id: number;
  alias: string;
  email: string;
}

export interface TaskMilestone {
  uuid: string;
  title: string;
}

export interface UpsertTaskCommand {
  title: string;
  description?: string;
  durationWeeks: number;
  startDate: DateType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds?: Array<number>;
  milestoneUuid?: string | null;
}

export type UpsertTaskCommandForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  durationWeeks: FormControl<number>;
  startDate: DateTypeForm;
  status: FormControl<TaskStatus>;
  priority: FormControl<TaskPriority>;
  assigneeIds: FormControl<Array<number>>;
  milestoneUuid: FormControl<string | null>;
}>;
