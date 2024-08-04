import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { createBusiness, getBusinessById, getBusinessByUserId } from '$lib/server/database/business-model';
import { businessSchema, linkTreeSchema } from '$lib/config/zod-schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';
import { createLinkTree, getTreeByBusiness, getTreeById, updateLinkTree } from '$lib/server/database/link-tree-model';

export const load = async (event: RequestEvent) => {
	//I only have this function here so it will check page again
	//instead of keeping it cache if it was client side only.
	//If only client side, it might still show the page even
	//if the user has logged out.

	//const session = await event.locals.auth.validate();

	const user = event.locals.user;
	if (!user) redirect(302, '/auth/sign-in');
	
	try {
		const business = await getBusinessByUserId(user.id)

		let linkTree;
		if (business) {
			linkTree = await getTreeByBusiness(business.id)
			event.locals.business = business
		}

		return { user, business, linkTree }
	} catch (e) {
		return {
			status: 500
		};
	}
};

export const actions = {
	business: async (event: RequestEvent) => {
		const form = await superValidate(event, businessSchema);
		let success = false

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const type = 'restaurant'
			let id = crypto.randomUUID();

			while ((await getBusinessById(id)) !== null) id = crypto.randomUUID();

			if (!event.locals.user) throw Error

			const business = {
				id,
				type,
				name: form.data.name,
				address: form.data.address,
				userId: event.locals.user.id
			}

			const newBusiness = await createBusiness(business)

			if (newBusiness) {
				let treeId = crypto.randomUUID();

				while ((await getTreeById(treeId)) !== null) treeId = crypto.randomUUID();

				await createLinkTree({
					id: treeId,
					businessId: id
				})

				setFlash({
					type: 'success',
					message: 'Restaurant successfully created!'
				}, event)

				success = true
			}

			return { form, success };
		} catch (e) {
			console.log(e);
			setFlash({ type: 'error', message: 'Business was not able to be created.' }, event);
			// email already in use
			// might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'An error occured while creating the business.');
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
		console.log(event.locals)
		try {
			if (!event.locals.user) throw Error
			if (!event.locals.business) throw Error

			const businessTree = await getTreeByBusiness(event.locals.business.id)

			const linkTree = {
				googleLink: form.data.googleLink,
				yelpLink: form.data.yelpLink,
				tripAdvisorLink: form.data.tripAdvisorLink,
				otherLinks: [],
				image: null,
				color: form.data.color
			}

			let updatedTree
			if (businessTree) updatedTree = await updateLinkTree(businessTree.id, linkTree)

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
			// email already in use
			// might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'An error occured while updating the link tree.');
		}
	}
}
