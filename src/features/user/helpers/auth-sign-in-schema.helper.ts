import { z } from 'zod';

export const schema = z.object({
  email: z.string().email('Provide your email address'),
  password: z.string().min(1, 'Provide your password'),
});

export const defaultValues = {
  email: '',
  password: '',
};
