import { z } from 'zod'

export default z.object({
  username: z
    .string()
    .min(5, { message: 'Username must be 5 or more characters long.' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(5, { message: 'Password must be 5 or more characters long.' })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((value) => /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(value), {
      message: 'Password must contain at least one special character.',
    }),
})
