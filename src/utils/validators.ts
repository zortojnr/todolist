export interface ValidationError {
  field: string;
  message: string;
}

export const validateTodo = (
  title: string,
  description: string,
  dueDate: string | null
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!title.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (title.trim().length > 255) {
    errors.push({ field: 'title', message: 'Title must be under 255 characters' });
  }

  if (description.length > 1000) {
    errors.push({ field: 'description', message: 'Description must be under 1000 characters' });
  }

  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'dueDate', message: 'Invalid date format' });
    }
  }

  return errors;
};

export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  return errors.find((e) => e.field === field)?.message;
};
