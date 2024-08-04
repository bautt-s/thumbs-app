<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from '$lib/components/ui/form';
    import * as Alert from '$lib/components/ui/alert';
    import { AlertCircle, Loader2 } from 'lucide-svelte'
    import { businessSchema } from '$lib/config/zod-schemas';
    import type { SuperValidated } from 'sveltekit-superforms';
	import type { AnyZodObject } from "zod";
	import { invalidateAll } from '$app/navigation';

    const createBusinessSchema = businessSchema.pick({
        name: true,
        address: true,
        googleLink: true
    })

    type CreateBusinessSchema = typeof createBusinessSchema;

    interface ExtendedSuperValidated<T extends AnyZodObject> extends SuperValidated<T> {
        success?: boolean;
    }

    export let form: ExtendedSuperValidated<CreateBusinessSchema>
    
    let open = false

    $: if (form) {
        open = !form.success
        if (form.success) invalidateAll()
    }
</script>

<Dialog.Root bind:open>
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