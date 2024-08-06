<script lang="ts">
	import { goto } from "$app/navigation";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { businessSchema, locationSchema } from '$lib/config/zod-schemas';
    import AddRestaurant from "$lib/components/dashboard/add-restaurant.svelte";
    import type { SuperValidated } from 'sveltekit-superforms';
	import type { AnyZodObject } from "zod";

    export let data;

    let business = data.business
    $: business = data.business

    let locations = data.locations
    $: locations = data.locations

    const createBusinessSchema = businessSchema.pick({
        name: true,
        address: true,
        googleLink: true
    })

    const createLocationSchema = locationSchema.pick({
        name: true,
        address: true
    })

    type CreateBusinessSchema = typeof createBusinessSchema;
    type CreateLocationSchema = typeof createLocationSchema;

    interface ExtendedSuperValidated<T extends AnyZodObject> extends SuperValidated<T> {
        success?: boolean;
    }

    let businessForm: ExtendedSuperValidated<CreateBusinessSchema>
    let locationForm: ExtendedSuperValidated<CreateLocationSchema>
</script>

<svelte:head>
	<title>Dashboard | Thumbs</title>
</svelte:head>

<section class="container flex flex-col gap-y-6 items-center">
        <div class="flex max-w-[980px] flex-col items-start gap-2">
            <h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                Dashboard
            </h1>
            <p class="max-w-[700px] text-lg text-muted-foreground">
                Manage your business, check your reviews, and more.
            </p>
        </div>
    
        <div class="flex flex-row lg:w-auto gap-6 w-[430px]">
            {#if !business}
            <Card.Root class="max-w-lg h-fit">
                <Card.Header>
                    <Card.Title tag='h2'>No restaurant found.</Card.Title>
                    <Card.Description>Seems like you have not added a restaurant. Let's change that!</Card.Description>
                </Card.Header>
                
                <Card.Footer class='flex-row gap-x-4'>
                    <AddRestaurant form={businessForm} />
                    <Button variant='outline' on:click={() => goto('/')}>Go to home</Button>
                </Card.Footer>
            </Card.Root>
            {:else}
            <Card.Root class="w-[430px] h-fit">
                <Card.Header>
                    <Card.Title>{business.name}</Card.Title>
                    <Card.Description>{business.address}</Card.Description>
                </Card.Header>
    
                <Card.Content>
                    <div class="flex flex-col w-full gap-y-4">
                        <span class='text-gray-500 text-sm'>
                            Some description you will write about your restaurant. 
                            Not implemented yet, just placeholder.
                        </span>

                        <Button on:click={() => goto('/dashboard/locations')}>Manage locations</Button>
                    </div>
                </Card.Content>
            </Card.Root>
            {/if}
        </div>
</section>