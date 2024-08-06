import { asc, eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { locationsTable } from '$lib/server/database/drizzle-schemas';
import type { Location, UpdateLocation } from '$lib/server/database/drizzle-schemas';

export const getLocationById = async (id: string) => {
	const location = await db.select().from(locationsTable).where(eq(locationsTable.id, id));
	if (location.length === 0) {
		return null;
	} else {
		return location[0];
	}
};

export const getLocationsByBusiness = async (businessId: string) => {
	const locations = await db.select()
		.from(locationsTable)
		.where(eq(locationsTable.businessId, businessId))
		.orderBy(asc(locationsTable.createdAt));
		
	if (locations.length === 0) {
		return null;
	} else {
		return locations;
	}
};

export const updateLocation = async (id: string, location: UpdateLocation) => {
	const result = await db.update(locationsTable).set(location).where(eq(locationsTable.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createLocation = async (location: Location) => {
	const result = await db.insert(locationsTable).values(location).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const deleteLocation = async (id: string) => {
    const result = await db.delete(locationsTable).where(eq(locationsTable.id, id)).returning()
    if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}