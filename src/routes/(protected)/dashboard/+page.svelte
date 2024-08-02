<script lang="ts">
	import { goto } from "$app/navigation";
    import * as Alert from '$lib/components/ui/alert';
    import * as Card from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from '$lib/components/ui/form';
    import Button from "$lib/components/ui/button/button.svelte";
	import { Loader2 } from 'lucide-svelte';
    import { AlertCircle } from 'lucide-svelte'
    import { businessSchema } from '$lib/config/zod-schemas';
    import type { SuperValidated } from 'sveltekit-superforms';

    export let data;

    const {
        user,
        business
    } = data

    const createBusinessSchema = businessSchema.pick({
        name: true,
        address: true,
        googleLink: true
    })

    type CreateBusinessSchema = typeof createBusinessSchema;

    export let form: SuperValidated<CreateBusinessSchema>;
</script>

<svelte:head>
	<title>Dashboard - Thumbs</title>
</svelte:head>

<section class="container flex flex-col gap-6 items-center">
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
            <Dialog.Root>
                <Dialog.Trigger class="bg-slate-900 text-white px-4 h-10 rounded-lg font-semibold text-sm
                hover:bg-slate-800 transition-all duration-150">
                    Add restaurant
                </Dialog.Trigger>

                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                      <Dialog.Title>Add restaurant</Dialog.Title>
                      <Dialog.Description>
                        Link a restaurant here. Add as much information as possible.
                      </Dialog.Description>
                    </Dialog.Header>
                    <Form.Root let:submitting let:errors method="POST" {form} schema={createBusinessSchema} let:config action="?/business">
                        <div class="grid gap-4">
                            {#if errors?._errors?.length}
                            <Alert.Root variant="destructive">
                                <AlertCircle class="h-4 w-4" />
                                <Alert.Title>Error</Alert.Title>
                                <Alert.Description>
                                    {#each errors._errors as error}
                                        {error}
                                    {/each}
                                </Alert.Description>
                            </Alert.Root>
				            {/if}

                            <Form.Field {config} name="name">
                                <Form.Item>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Input />
                                    <Form.Validation />
                                </Form.Item>
                            </Form.Field>
                            <Form.Field {config} name="address">
                                <Form.Item>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Input />
                                    <Form.Validation />
                                </Form.Item>
                            </Form.Field>
                            <Form.Field {config} name="googleLink">
                                <Form.Item>
                                    <Form.Label>Google URL</Form.Label>
                                    <Form.Input />
                                    <Form.Validation />
                                </Form.Item>
                            </Form.Field>

                            <Form.Button class="w-full" disabled={submitting}>
                                {#if submitting}
						        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
						        Please wait
                                {:else}
                                Create restaurant
                                {/if}
				            </Form.Button>
                        </div>
                    </Form.Root>
                  </Dialog.Content>
            </Dialog.Root>

            <Button variant='outline' on:click={() => goto('/')}>Go to home</Button>
        </Card.Footer>
    </Card.Root>
    {:else}
    <Card.Root class="w-[420px]">
        <Card.Header>
            <Card.Title>{business.name}</Card.Title>
            <Card.Description>{business.address}</Card.Description>
        </Card.Header>

        <Card.Content>
            <div class="grid w-full">
                <span class='font-semibold'>This is your restaurant!</span>
                <a href={business.googleLink} class='hover:underline'>Review it here</a>
            </div>
        </Card.Content>
    </Card.Root>
    {/if}
</section>
