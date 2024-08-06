import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { linkTreeTable } from '$lib/server/database/drizzle-schemas';
import type { LinkTree, UpdateLinkTree } from '$lib/server/database/drizzle-schemas';

export const getTreeById = async (id: string) => {
	const tree = await db.select().from(linkTreeTable).where(eq(linkTreeTable.id, id));
	if (tree.length === 0) {
		return null;
	} else {
		return tree[0];
	}
};

export const getTreeByLocation = async (locationId: string) => {
	const tree = await db.select().from(linkTreeTable).where(eq(linkTreeTable.locationId, locationId));
	if (tree.length === 0) {
		return null;
	} else {
		return tree[0];
	}
};

export const updateLinkTree = async (id: string, tree: UpdateLinkTree) => {
	const result = await db.update(linkTreeTable).set(tree).where(eq(linkTreeTable.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createLinkTree = async (tree: LinkTree) => {
	const result = await db.insert(linkTreeTable).values(tree).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};