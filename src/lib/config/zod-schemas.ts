import { z } from 'zod';

export const userSchema = z.object({
	firstName: z
		.string({ required_error: 'First Name is required.' })
		.min(1, { message: 'First Name is required.' })
		.trim(),
	lastName: z
		.string({ required_error: 'Last Name is required.' })
		.min(1, { message: 'Last Name is required.' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required.' })
		.email({ message: 'Please enter a valid email address.' }),
	password: z
		.string({ required_error: 'Password is required.' })
		.min(6, { message: 'Password must be at least 6 characters.' })
		.trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required.' })
		.min(6, { message: 'Password must be at least 6 characters.' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'], { required_error: 'You must have a role.' })
		.default('USER'),
	verified: z.boolean().default(false),
	terms: z.literal<boolean>(true, {
		errorMap: () => ({ message: "You must accept the terms & privacy policy." }),
	}),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(true),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});

export type UserSchema = typeof userSchema;

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match.',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match.',
				path: ['confirmPassword']
			});
		}
	});

export type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

export const businessSchema = z.object({
	name: z
		.string({ required_error: 'Name is required.' })
		.min(1, { message: 'Name is required.' })
		.trim(),
	address: z
		.string({ required_error: 'Address is required.' })
		.min(1, { message: 'Address is required.' })
		.trim(),
	/*type: z
		.string({ required_error: 'Type is required.' })
		.min(1, { message: 'Type is required.' })
		.trim(),*/
})

export const linkTreeSchema = z.object({
	id: z
		.string(), // for internal use
	googleLink: z
		.string()
		.url()
		.refine((url) => {
			return url.startsWith('https://www.google.com') || url.startsWith('http://www.google.com');
		}, {
			message: "Must be a valid Google URL.",
		}),
	yelpLink: z
		.string()
		.url()
		.refine((url) => {
			return url.startsWith('https://www.yelp.com') || url.startsWith('http://www.yelp.com');
		}, {
			message: "Must be a valid Yelp URL.",
		}),
	imageLink: z
		.string()
		.trim(),
	color: z
		.string(),
	visible: z
		.boolean()
})


export const locationSchema = z.object({
	id: z
		.string(), // for internal use
	name: z
		.string({ required_error: 'Name is required.' })
		.min(1, { message: 'Name is required.' })
		.trim(),
	image: z
		.string()
		.trim(),
	address: z
		.string({ required_error: 'Name is required.' })
		.min(1, { message: 'Name is required.' })
		.trim(),
})