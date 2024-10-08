<script lang='ts'>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from '$lib/components/ui/form';
	import { locationSchema } from "$lib/config/zod-schemas";
    import * as Alert from '$lib/components/ui/alert';
    import Button from "$lib/components/ui/button/button.svelte";
    import { AlertCircle, Loader2 } from 'lucide-svelte'
	import { invalidateAll } from "$app/navigation";

    const createLocationSchema = locationSchema.pick({
        name: true,
        address: true
    })

    export let form: any

    let open = false

    $: if (form && form.success) {
        open = !form.success
        if (form.success) invalidateAll()
        form = null
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder on:click={() => open = true}>
        <Button builders={[builder]}>
            Add location
        </Button>
    </Dialog.Trigger>

    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Add location</Dialog.Title>
            <Dialog.Description>
              Link a new location for your clients to review
            </Dialog.Description>

            <Form.Root let:submitting let:errors method="POST" {form} schema={createLocationSchema} let:config action="?/add">
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
                    <Form.Button class="w-full" disabled={submitting}>
                        {#if submitting}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                        {:else}
                        Create location
                        {/if}
                    </Form.Button>
                </div>
            </Form.Root>
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>