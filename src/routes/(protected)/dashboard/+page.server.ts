import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { createBusiness, getBusinessById, getBusinessByUserId } from '$lib/server/database/business-model';
import { businessSchema } from '$lib/config/zod-schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';

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

		return { user, business }
	} catch (e) {
		return {
			status: 500
		};
	}
};

export const actions = {
	business: async (event: RequestEvent) => {
		const form = await superValidate(event, businessSchema);
		console.log(form)

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
				googleLink: form.data.googleLink,
				userId: event.locals.user.id
			}

			const newBusiness = await createBusiness(business)

			if (newBusiness) {
				setFlash({
					type: 'success',
					message: 'Restaurant successfully created!'
				}, event)
			}
		} catch (e) {
			console.log(e);
			setFlash({ type: 'error', message: 'Business was not able to be created.' }, event);
			// email already in use
			//might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'An error occured while creating the business.');
		}
		return { form };
	}
}
