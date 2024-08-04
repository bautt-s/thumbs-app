import { getBusinessById } from "$lib/server/database/business-model";
import { getTreeByBusiness } from "$lib/server/database/link-tree-model";
import type { RequestEvent } from "./$types";

export const load = async (event: RequestEvent) => {
    try {
        if (event.params.businessId) {
            const businessId = event.params.businessId
            let linkTree = await getTreeByBusiness(businessId)
            let business = await getBusinessById(businessId)

            if (linkTree && business) return { linkTree, business }
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