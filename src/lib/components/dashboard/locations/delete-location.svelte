<script lang='ts'>
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Loader2, Trash2 } from 'lucide-svelte'
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { invalidateAll } from "$app/navigation";

    export let locationId: string

    let open = false
    let formLoading = false

    const handleResult: SubmitFunction = () => {
        formLoading = true
        return async ({ result }) => {
            formLoading = true
            if (result.type === "success") {
                open = false
                invalidateAll()
            }
        }
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
        <Button builders={[builder]} class="mx-auto flex h-fit px-[6px]" variant="ghost">
            <Trash2 class="w-5 h-5" />
        </Button>
    </Dialog.Trigger>

    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Delete location</Dialog.Title>
            <Dialog.Description>Are you sure you want to delete this location?</Dialog.Description>
        </Dialog.Header>

        <div class="flex flex-row gap-x-4 w-full mt-2">
            <form method="post" use:enhance={handleResult} action="?/delete" class="w-full">
                <input type="hidden" name="id" bind:value={locationId} />
                <button type="submit" class="font-semibold text-white bg-red-800 hover:bg-red-900 
                transition-all duration-150 px-2 py-2 rounded-lg text-sm w-full" disabled={formLoading}>
                    {#if formLoading}
                        <div class="flex flex-row items-center mx-auto w-fit">
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                            <span class="mt-[1px]">Please wait...</span>
                        </div>
                    {:else}
                        Delete
                    {/if}
                </button>
            </form>

            <button class="font-semibold text-gray-900 px-2 py-2 rounded-lg text-sm w-full
            border-gray-400 border-[1px] hover:bg-gray-50 transition-all duration-150"
            on:click={() => open = false}>
                Cancel
            </button>
        </div>
    </Dialog.Content>
</Dialog.Root>