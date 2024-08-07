<script lang='ts'>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from '$lib/components/ui/form';
	import { locationSchema } from "$lib/config/zod-schemas";
    import * as Alert from '$lib/components/ui/alert';
    import Button from "$lib/components/ui/button/button.svelte";
    import { AlertCircle, Loader2, Pencil } from 'lucide-svelte'
	import { invalidateAll } from "$app/navigation";

    const createLocationSchema = locationSchema.pick({
        id: true,
        name: true,
        address: true
    })

    export let form: any
    export let location: {
        id: string
        name: string 
        image: string | null
        address: string | null
        businessId: string
    }
    
    let open = false
    
    $: if (form && form.success) {
        open = !form.success
        if (form.success) invalidateAll()
        form = null
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
        <Button builders={[builder]} class="mx-auto flex h-fit px-[5px]" variant="ghost">
            <Pencil class="w-[18px] h-[18px]" />
        </Button>
    </Dialog.Trigger>

    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Add location</Dialog.Title>
            <Dialog.Description>
              Link a new location for your clients to review
            </Dialog.Description>
        </Dialog.Header>
            <Form.Root let:submitting let:errors method="POST" {form} schema={createLocationSchema} let:config action="?/edit">
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
                    
                    <div class="hidden">
                        <Form.Field {config} name="id">
                            <Form.Item>
                                <Form.Input value={location?.id} />
                            </Form.Item>
                        </Form.Field>
                    </div>
    
                    <Form.Field {config} name="name">
                        <Form.Item>
                            <Form.Label>Name</Form.Label>
                            <Form.Input value={location.name} />
                            <Form.Validation />
                        </Form.Item>
                    </Form.Field>
                    <Form.Field {config} name="address">
                        <Form.Item>
                            <Form.Label>Address</Form.Label>
                            <Form.Input value={location.address || ''} />
                            <Form.Validation />
                        </Form.Item>
                    </Form.Field>
                    <Form.Button class="w-full" disabled={submitting}>
                        {#if submitting}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                        {:else}
                        Edit location
                        {/if}
                    </Form.Button>
                </div>
            </Form.Root>
       
    </Dialog.Content>
</Dialog.Root>