<script lang='ts'>
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Form from '$lib/components/ui/form';
    import * as Alert from '$lib/components/ui/alert';
	import Button from "$lib/components/ui/button/button.svelte";
	import { linkTreeSchema } from "$lib/config/zod-schemas";
    import { AlertCircle, Loader2, TreeDeciduous } from 'lucide-svelte'
	import { invalidateAll } from "$app/navigation";

    const createLinkTreeSchema = linkTreeSchema.pick({
        id: true,
        googleLink: true,
        yelpLink: true,
        tripAdvisorLink: true,
        color: true,
        visible: true
    })

    export let form: any
    export let locationName: string
    export let linkTree

    $: if (form && form.success) {
        if (form.success) invalidateAll()
        form = null
    }  
</script>   

<Sheet.Root>
    <Sheet.Trigger asChild let:builder>
        <div class="flex flex-row gap-x-2">
            <Button builders={[builder]} variant="ghost" class="h-fit px-[6px]">
                <TreeDeciduous class="w-5 h-5" />
            </Button>
        </div>
    </Sheet.Trigger>
    <Sheet.Content>
        <Sheet.Header>
            <Sheet.Title>Edit link tree</Sheet.Title>
            <Sheet.Description>
              Edit "{locationName}" link tree. Add links to Google and Yelp, as well as links to other
              websites, or change your tree's color.
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

                <div class="hidden">
                    <Form.Field {config} name="id">
                        <Form.Item>
                            <Form.Input value={linkTree?.id} />
                        </Form.Item>
                    </Form.Field>
                </div>

                <Form.Field {config} name="googleLink">
                    <Form.Item>
                        <Form.Label>Google URL</Form.Label>
                        <Form.Input value={linkTree?.googleLink} />
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>
                <Form.Field {config} name="yelpLink">
                    <Form.Item>
                        <Form.Label>Yelp URL</Form.Label>
                        <Form.Input value={linkTree?.yelpLink} />
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>
                <Form.Field {config} name="tripAdvisorLink">
                    <Form.Item>
                        <Form.Label>Trip Advisor URL</Form.Label>
                        <Form.Input value={linkTree?.tripAdvisorLink} />
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>       
                
                <Form.Field {config} name="color">
                    <div class="flex flex-row items-center">
                        <Form.Input value={linkTree?.color} type='color' class="w-11 h-10 mr-4" />
                        <div class="flex flex-col">
                            <span class="font-semibold text-sm">Main color</span>
                            <span class="text-sm text-gray-500">Pick the prominent color of your link tree.</span>
                        </div>
                    </div>
                </Form.Field>
                <Form.Field {config} name="visible">
                    <div class="flex flex-row items-center gap-x-4 mt-6">
                        <Form.Switch value={linkTree.visible} />
                        <div class="flex flex-col">
                            <span class="font-semibold text-sm">Visible tree</span>
                            <span class="text-sm text-gray-500">Enable or disable this location's tree.</span>
                        </div>
                    </div>
                </Form.Field>
            
                <Form.Button class="w-full mt-6" disabled={submitting}>
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