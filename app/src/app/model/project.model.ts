import { FormControl, FormGroup, FormRecord } from "@angular/forms";
import { DateType, DateTypeForm } from "./core.model";

export interface Project {
  uuid: string;
  title: string;
  description?: string;
  startDate: DateType;
  endDate: DateType;
  additionalFields?: Record<string, string>;
  ownerId?: number;
  members?: Array<ProjectMember>;
}

export interface UpsertProjectCommand {
  title: string;
  description?: string;
  startDate: DateType;
  endDate: DateType;
  additionalFields?: Record<string, string>;
}

export type UpsertProjectCommandForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  startDate: DateTypeForm;
  endDate: DateTypeForm;
  additionalFields: FormRecord<FormControl<string>>;
}>;

export interface ProjectMember {
  id: number;
  alias: string;
  email: string;
  role?: string;
}

export interface AddMemberCommand {
  email: string;
  role?: string;
}
