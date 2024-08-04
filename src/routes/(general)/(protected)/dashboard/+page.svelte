<script lang="ts">
	import { goto } from "$app/navigation";
    import * as Alert from '$lib/components/ui/alert';
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { ListTree } from 'lucide-svelte'
    import { businessSchema, linkTreeSchema } from '$lib/config/zod-schemas';
    import AddRestaurant from "$lib/components/dashboard/add-restaurant.svelte";
    import UpdateLinkTree from "$lib/components/dashboard/update-linktree.svelte";
    import type { SuperValidated } from 'sveltekit-superforms';
	import type { AnyZodObject } from "zod";

    export let data;

    let business = data.business
    $: business = data.business

    let linkTree = data.linkTree
    $: linkTree = data.linkTree

    const createBusinessSchema = businessSchema.pick({
        name: true,
        address: true,
        googleLink: true
    })

    const createLinkTreeSchema = linkTreeSchema.pick({
        googleLink: true,
        yelpLink: true,
        tripAdvisorLink: true,
        color: true
    })

    type CreateBusinessSchema = typeof createBusinessSchema;
    type CreateLinkTreeSchema = typeof createLinkTreeSchema;

    interface ExtendedSuperValidated<T extends AnyZodObject> extends SuperValidated<T> {
        success?: boolean;
    }

    export let businessForm: ExtendedSuperValidated<CreateBusinessSchema>
    export let linkTreeForm: ExtendedSuperValidated<CreateLinkTreeSchema>
</script>

<svelte:head>
	<title>Dashboard | Thumbs</title>
</svelte:head>

<section class="container flex flex-col items-center gap-y-6">
        <div class="flex max-w-[980px] flex-col items-start gap-2">
            <h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                Dashboard
            </h1>
            <p class="max-w-[700px] text-lg text-muted-foreground">
                Manage your business, check your reviews, and more.
            </p>
        </div>
    
        {#if !business}
        <Card.Root class="max-w-lg">
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
        <Card.Root class="w-[430px]">
            <Card.Header>
                <Card.Title>{business.name}</Card.Title>
                <Card.Description>{business.address}</Card.Description>
            </Card.Header>
    
            <Card.Content>
                <div class="grid w-full">
                    <span class='text-gray-500 text-sm'>
                        Some description you will write about your restaurant. 
                        Not implemented yet, just placeholder.
                    </span>
                </div>
            </Card.Content>
        </Card.Root>
        {/if}

    {#if business}
    <Card.Root class="w-[430px] flex flex-col">
        <Card.Header>
            <Card.Title>Link Tree</Card.Title>
            <Card.Description>Manage the links displayed in your link tree</Card.Description>
        </Card.Header>
        
        <Card.Content class="flex flex-col mx-auto h-fit w-full">
            {#if linkTree}
                {#if (!linkTree.googleLink) && (!linkTree.yelpLink) 
                && (!linkTree.tripAdvisorLink) && (linkTree.otherLinks.length === 0)}
                    <Alert.Root class="mb-8">
                        <ListTree class="h-4 w-4" />
                        
                        <Alert.Title>Your link tree is empty!</Alert.Title>

                        <Alert.Description class="text-gray-500">
                            You can add links to it, pressing the button below.
                        </Alert.Description>
                    </Alert.Root>

                    <UpdateLinkTree form={linkTreeForm} empty={true} linkTree={linkTree} />
                {:else}
                    <div class="w-full">
                        <UpdateLinkTree form={linkTreeForm} empty={false} linkTree={linkTree} />
                    </div>
                {/if}
            {/if}
        </Card.Content>
    </Card.Root>
    {/if}
</section>