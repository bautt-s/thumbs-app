<script lang='ts'>
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Form from '$lib/components/ui/form';
    import * as Alert from '$lib/components/ui/alert';
	import Button from "$lib/components/ui/button/button.svelte";
	import { linkTreeSchema } from "$lib/config/zod-schemas";
    import { AlertCircle, Loader2 } from 'lucide-svelte'
	import type { AnyZodObject } from "zod";
	import type { SuperValidated } from "sveltekit-superforms";
	import { invalidateAll } from "$app/navigation";
    import { goto } from '$app/navigation';

    const createLinkTreeSchema = linkTreeSchema.pick({
        googleLink: true,
        yelpLink: true,
        tripAdvisorLink: true,
        color: true
    })

    type CreateLinkTreeSchema = typeof createLinkTreeSchema;

    interface ExtendedSuperValidated<T extends AnyZodObject> extends SuperValidated<T> {
        success?: boolean;
    }

    interface LinkTree {
        id: string
        googleLink: string | null
        yelpLink: string | null
        tripAdvisorLink: string | null
        otherLinks: any[]
        image: string | null
        businessId: string
        color: string | null
    }

    export let form: ExtendedSuperValidated<CreateLinkTreeSchema>
    export let empty: boolean
    export let linkTree: LinkTree
    
    let open = false

    $: if (form) {
        open = !form.success
        if (form.success) invalidateAll()
    }
</script>

<Sheet.Root>
    <Sheet.Trigger asChild let:builder>
        <div class="flex flex-row gap-x-2">
            {#if !empty}
                <Button class='w-full' on:click={() => goto(`/link-tree/${linkTree.businessId}`)}>
                    My link tree
                </Button>
            {/if}

            <Button builders={[builder]} class='w-full' variant={empty ? "default" : "outline"}>
                {empty ? 'Add links' : 'Edit links'}
            </Button>
        </div>
    </Sheet.Trigger>
    <Sheet.Content>
        <Sheet.Header>
            <Sheet.Title>Add links to your link tree</Sheet.Title>
            <Sheet.Description>
              You can add links to Google, Yelp and TripAdvisor, as well as links to other
              websites. You can also change the background of your link tree.
            </Sheet.Description>
          </Sheet.Header>

          <Form.Root let:submitting let:errors method="POST" {form} class="mt-6"
          schema={createLinkTreeSchema} let:config action="?/linkTree">
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

                <Form.Field {config} name="googleLink">
                    <Form.Item>
                        <Form.Label>Google URL</Form.Label>
                        <Form.Input value={linkTree.googleLink} />
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>
                <Form.Field {config} name="yelpLink">
                    <Form.Item>
                        <Form.Label>Yelp URL</Form.Label>
                        <Form.Input value={linkTree.yelpLink} />
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>
                <Form.Field {config} name="tripAdvisorLink">
                    <Form.Item>
                        <Form.Label>Trip Advisor URL</Form.Label>
                        <Form.Input value={linkTree.tripAdvisorLink} />
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>
                
                <Form.Field {config} name="color">
                    <div class="flex flex-row items-center">
                        <Form.Input value={linkTree.color} type='color' class="w-11 h-10 mr-4" />
                        <div class="flex flex-col">
                            <span class="font-semibold text-sm">Main color</span>
                            <span class="text-sm text-gray-500">Pick the prominent color of your link tree.</span>
                        </div>
                    </div>
                </Form.Field>
            
                <Form.Button class="w-full mt-4" disabled={submitting}>
                    {#if submitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                    {:else}
                    Update link tree
                    {/if}
                </Form.Button>
            </div>
        </Form.Root>
    </Sheet.Content>
</Sheet.Root>