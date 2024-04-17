import { z } from 'zod'
const datePatterns = [
  // yyyy-mm-dd
  /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{2})$/,
  // dd-mm-yyyy
  /^(?<day>\d{2})-(?<month>\d{1,2})-(?<year>\d{4})$/,
  // mm-dd-yyyy
  /^(?<month>\d{1,2})-(?<day>\d{2})-(?<year>\d{4})$/,
]

const flexibleDateSchema = z
  .string()
  .refine(
    (value: string) => {
      for (const datePattern of datePatterns) {
        const match = datePattern.exec(value)

        if (match) {
          const { day, month, year } = match.groups as { [key: string]: string }

          const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
          )

          if (
            parsedDate instanceof Date &&
            !isNaN(parsedDate.getTime()) &&
            parsedDate.getDate() === Number(day) &&
            parsedDate.getMonth() === Number(month) - 1
          ) {
            return true
          }
        }
      }

      return false
    },
    {
      message: "That's not a date.",
    },
  )
  .transform((value) => {
    for (const datePattern of datePatterns) {
      const match = datePattern.exec(value)

      if (match) {
        const { day, month, year } = match.groups as { [key: string]: string }

        const parsedDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
        )

        if (
          parsedDate instanceof Date &&
          !isNaN(parsedDate.getTime()) &&
          parsedDate.getDate() === Number(day) &&
          parsedDate.getMonth() === Number(month) - 1
        ) {
          return parsedDate
        }
      }
    }

    throw new Error('Invalid date format.')
  })
  .refine((value) => value instanceof Date, { message: 'Invalid date.' })

export default z.object({
  name: z
    .string()
    .min(5, { message: 'Name must be 5 or more characters long.' }),
  description: z
    .string()
    .min(5, { message: 'Description must be 5 or more characters long.' }),
  date: flexibleDateSchema,
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
