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
  assignee?: TaskAssignee | null;
  milestone?: TaskMilestone | null;
}

export type TaskStatus = 'pending' | 'done';

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
  assigneeId?: number | null;
  milestoneUuid?: string | null;
}

export type UpsertTaskCommandForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  durationWeeks: FormControl<number>;
  startDate: DateTypeForm;
  status: FormControl<TaskStatus>;
  assigneeId: FormControl<number | null>;
  milestoneUuid: FormControl<string | null>;
}>;
