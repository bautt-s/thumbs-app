import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	provider: text('provider').notNull().default('email'),
	providerId: text('provider_id').notNull().default(''),
	email: text('email').notNull().unique(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	role: text('role').notNull().default('USER'),
	verified: boolean('verified').notNull().default(false),
	receiveEmail: boolean('receive_email').notNull().default(true),
	password: text('password'),
	token: text('token').unique(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const sessionTable = pgTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const businessTable = pgTable('businesses', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	type: text('type').notNull(),
	address: text('address').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
});

export const linkTreeTable = pgTable('link_trees', {
	id: text('id').notNull().primaryKey(),
	googleLink: text('google_link'),
	yelpLink: text('yelp_link'),
	otherLinks: jsonb('other_links').array(),
	image: text('image'),
	color: text('color'),
	visible: boolean('visible'),
	locationId: text('location_id')
		.notNull()
		.references(() => locationsTable.id, { onDelete: 'cascade' }),
});

export const locationsTable = pgTable('locations', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	image: text('image'),
	address: text('address'),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	businessId: text('business_id')
		.notNull()
		.references(() => businessTable.id),
});

export type User = typeof userTable.$inferInsert;
export type UpdateUser = Partial<typeof userTable.$inferInsert>;

export type Session = typeof sessionTable.$inferInsert;

export type Business = typeof businessTable.$inferInsert;
export type UpdateBusiness = Partial<typeof businessTable.$inferInsert>;

export type LinkTree = typeof linkTreeTable.$inferInsert;
export type UpdateLinkTree = Partial<typeof linkTreeTable.$inferInsert>;

export type Location = typeof locationsTable.$inferInsert;
export type UpdateLocation = Partial<typeof locationsTable.$inferInsert>;