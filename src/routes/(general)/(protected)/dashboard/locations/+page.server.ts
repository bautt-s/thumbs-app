import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { getBusinessByUserId } from "$lib/server/database/models/business-model";
import { createLinkTree, getTreeById, getTreeByLocation, updateLinkTree } from "$lib/server/database/models/link-tree-model";
import { createLocation, deleteLocation, getLocationById, getLocationsByBusiness, updateLocation } from "$lib/server/database/models/locations-model";
import { setError, superValidate } from "sveltekit-superforms/server";
import { linkTreeSchema, locationSchema } from "$lib/config/zod-schemas";
import { setFlash } from "sveltekit-flash-message/server";

export const load = async (event: RequestEvent) => {
	const user = event.locals.user;
	if (!user) redirect(302, '/auth/sign-in');
	
	try {
		const business = await getBusinessByUserId(user.id)
		let locations;

		let linkTrees: {
			id: string
			googleLink: string | null
			yelpLink: string | null
			otherLinks: any[] | null
			color: string | null
			locationId: string
		}[] = []

		if (business) {
			locations = await getLocationsByBusiness(business.id)

			if (locations) {
				for (const location of locations) {
					const lt = await getTreeByLocation(location.id)
					if (lt) linkTrees.push(lt)
				}
			}
			
			event.locals.business = business
		}

		return { user, business, locations, linkTrees }
	} catch (e) {
		return {
			status: 500
		};
	}
};

export const actions = {
	add: async (event: RequestEvent) => {
		const form = await superValidate(event, locationSchema);
		let success = false

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		
		try {
			let id = crypto.randomUUID();

			while ((await getLocationById(id)) !== null) id = crypto.randomUUID();

			if (!event.locals.user) throw Error

			const location = {
				id,
				createdAt: new Date(),
				name: form.data.name,
				address: form.data.address,
				businessId: event.locals.business?.id || '' // if the user got here, they have a business, no need to check
			}

			const newLocation = await createLocation(location)

			if (newLocation) {
				let treeId = crypto.randomUUID();

				while ((await getTreeById(treeId)) !== null) treeId = crypto.randomUUID();

				await createLinkTree({
					id: treeId,
					locationId: id
				})

				setFlash({
					type: 'success',
					message: 'Location added!'
				}, event)

				success = true
			}
			
			return { form, success };
		} catch (e) {
			console.log(e);
			setFlash({ type: 'error', message: 'Location was not able to be created.' }, event);
			// email already in use
			// might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'An error occured while creating the location.');
		}
	},

	edit: async (event: RequestEvent) => {
		const form = await superValidate(event, locationSchema);
		let success = false
		
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!event.locals.user) throw Error

			const location = {
				name: form.data.name,
				address: form.data.address
			}

			// id will be there, despite what TS says
			const updatedLocation = await updateLocation(form?.data.id || '', location) 
			
			if (updatedLocation) {
				setFlash({
					type: 'success',
					message: 'Location updated!'
				}, event)

				success = true
			}

			return { form, success };
		} catch (e) {
			console.log(e);
			setFlash({ type: 'error', message: 'Location was not able to be updated.' }, event);

			return setError(form, 'An error occured while updating the location.');
		}
	},

	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const locationId = formData.get('id');

		if (!locationId) throw new Error('No location ID provided.');
    	if (typeof locationId !== 'string') throw new Error('Invalid location ID.')
    	
		try {
			if (!event.locals.user) throw new Error('Unauthorized.');
			const deletedLocation = await deleteLocation(locationId) 

			if (deletedLocation) {
				
				setFlash({
					type: 'success',
					message: 'Location deleted!'
				}, event)
			}
		} catch (e) {
			setFlash({ type: 'error', message: 'Location was not able to be deleted.' }, event);
		}
	},

	linkTree: async (event: RequestEvent) => {
		const form = await superValidate(event, linkTreeSchema);
		let success = false

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!event.locals.user) throw Error
			if (!event.locals.business) throw Error
			
			const linkTree = {
				googleLink: form.data.googleLink || '',
				yelpLink: form.data.yelpLink || '',
				tripAdvisorLink: form.data.tripAdvisorLink || '',
				image: null,
				color: form.data.color,
				visible: form.data.visible
 			}

			let updatedTree = await updateLinkTree(form.data.id, linkTree)

			if (updatedTree) {
				setFlash({
					type: 'success',
					message: 'Link tree successfully updated!'
				}, event)

				success = true
			}

			return { form, success };
		} catch (e) {
			console.log(e);
			setFlash({ type: 'error', message: 'Link tree was not able to be updated.' }, event);
		
			return setError(form, 'An error occured while updating the link tree.');
		}
	}
}
