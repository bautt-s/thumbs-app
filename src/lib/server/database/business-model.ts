import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { businessTable } from '$lib/server/database/drizzle-schemas';
import type { Business, UpdateBusiness } from '$lib/server/database/drizzle-schemas';

export const getBusinessById = async (id: string) => {
    const business = await db.select().from(businessTable).where(eq(businessTable.id, id));
	if (business.length === 0) {
		return null;
	} else {
		return business[0];
	}
}

export const getBusinessByUserId = async (user_id: string) => {
    const business = await db.select().from(businessTable).where(eq(businessTable.userId, user_id));
	if (business.length === 0) {
		return null;
	} else {
		return business[0];
	}
}

export const updateBusiness = async (id: string, business: UpdateBusiness) => {
    const result = await db.update(businessTable).set(business).where(eq(businessTable.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

export const createBusiness = async (business: Business) => {
    const result = await db.insert(businessTable).values(business).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

export const deleteBusiness = async (id: string) => {
    const result = await db.delete(businessTable).where(eq(businessTable.id, id)).returning()
    if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}