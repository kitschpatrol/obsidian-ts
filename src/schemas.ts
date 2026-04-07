// Unused

import { z } from 'zod'

export const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
	z.codec(z.string(), schema, {
		decode(jsonString, context) {
			try {
				// eslint-disable-next-line ts/no-unsafe-return
				return JSON.parse(jsonString)
			} catch (error) {
				context.issues.push({
					code: 'invalid_format',
					format: 'json',
					input: jsonString,
					message: error instanceof Error ? error.message : 'Invalid JSON',
				})
				return z.NEVER
			}
		},
		encode: (value) => JSON.stringify(value),
	})

// //   const UserSchema = z.object({ id: z.string(), name: z.string() })
// //   const UserJsonCodec = jsonCodec(UserSchema)

// // UserJsonCodec.decode('{"id":"1","name":"Alice"}') // => { id: "1", name: "Alice" }
// // UserJsonCodec.encode({ id: '1', name: 'Alice' }) // => '{"id":"1","name":"Alice"}'
