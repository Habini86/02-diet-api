import { z } from 'zod'

export default z.object({
  name: z
    .string()
    .min(5, { message: 'Name must be 5 or more characters long.' }),
  description: z
    .string()
    .min(5, { message: 'Description must be 5 or more characters long.' }),
  date: z.coerce.date({
    required_error: 'Please select a date.',
    invalid_type_error: "That's not a date.",
  }),
  time: z
    .string()
    .refine((time) => /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: 'Invalid time format, expected hh:mm.',
    }),
  diet: z.boolean({
    required_error: 'Please select True or False.',
    invalid_type_error: "That's not a boolean.",
  }),
})
