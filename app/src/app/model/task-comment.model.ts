export interface TaskCommentAuthor {
  id: number;
  alias: string;
  email: string;
}

export interface TaskComment {
  id: number;
  taskUuid: string;
  author: TaskCommentAuthor;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertTaskCommentCommand {
  body: string;
}
