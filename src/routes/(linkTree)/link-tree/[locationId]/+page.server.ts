import { getTreeByLocation } from "$lib/server/database/models/link-tree-model";
import { getLocationById } from "$lib/server/database/models/locations-model";
import type { RequestEvent } from "./$types";

export const load = async (event: RequestEvent) => {
    try {
        if (event.params.locationId) {
            const locationId = event.params.locationId
            let linkTree = await getTreeByLocation(locationId)
            let location = await getLocationById(locationId)

            if (linkTree && location) return { linkTree, location }
            else return {
                status: 404
            }
        }
    } catch (e) {
        return {
            status: 500
        };
    }
};