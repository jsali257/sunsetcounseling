/** Result shape shared by admin server actions used with useActionState. */
export type ActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Shown once, e.g. a newly generated temporary password. */
  secret?: string;
};

export const idle: ActionState = {};
