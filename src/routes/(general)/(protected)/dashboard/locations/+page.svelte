<script lang='ts'>
    import QrCode from '$lib/components/dashboard/locations/qr-code.svelte';
	import AddLocation from '$lib/components/dashboard/locations/add-location.svelte';
    import EditLocation from '$lib/components/dashboard/locations/edit-location.svelte';
    import UpdateLinktree from '$lib/components/dashboard/locations/update-linktree.svelte';
    import * as Alert from '$lib/components/ui/alert';
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import { ExternalLink, ListTree } from 'lucide-svelte'
	import DeleteLocation from '$lib/components/dashboard/locations/delete-location.svelte';
    import Button from '$lib/components/ui/button/button.svelte';

    export let data
    
    let locations = data.locations
    $: locations = data.locations

    let linkTrees = data.linkTrees
    $: linkTrees = data.linkTrees

    export let form: any
</script>

<svelte:head>
    <title>Locations | Thumbs</title>
</svelte:head>

<section class='container flex flex-col gap-y-6 items-center'>
    <div class="flex max-w-[980px] flex-col items-center gap-2">
        <h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Locations
        </h1>
        <p class="max-w-[700px] text-lg text-muted-foreground">
            All of your locations, in one place
        </p>
    </div>
    
    <Card.Root class="max-w-[900px]">
        <Card.Content>
                <div class="flex flex-col">
                    {#if locations}
                        <Table.Root class="mb-4">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head>Location</Table.Head>
                                    <Table.Head>Name</Table.Head>
                                    <Table.Head class="hidden md:block relative top-3">Address</Table.Head>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {#each locations as location, i (i)}
                                <Table.Row class="text-sm font-semibold">
                                    <Table.Cell class="text-center">{i}</Table.Cell>
                                    <Table.Cell>{location.name}</Table.Cell>
                                    <Table.Cell class="hidden md:block top-3 relative">{location.address}</Table.Cell>

                                    <Table.Cell>
                                        <div class="flex flex-row justify-center items-center">
                                            <EditLocation location={location} form={form} />
                                            {#if linkTrees}
                                            <UpdateLinktree form={form} locationName={location.name}
                                            linkTree={linkTrees?.filter((lt) => lt.locationId === location.id)[0]}/>
                                            {/if}
    
                                            <DeleteLocation locationId={location.id} />
    
                                            <a href={`/link-tree/${location.id}`} target="_blank">
                                                <Button variant='ghost' class="px-1">
                                                    <ExternalLink class="w-5 h-5" />
                                                </Button>
                                            </a>
    
                                            <QrCode url={`/link-tree/${location.id}`} />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    {:else}
                        <Alert.Root class="mb-4 mt-4">
                            <ListTree class="h-4 w-4" />
                            
                            <Alert.Title>Your business has no locations!</Alert.Title>

                            <Alert.Description class="text-gray-500">
                                Let's register a location for clients to review
                            </Alert.Description>    
                        </Alert.Root>
                    {/if}

                    <AddLocation form={form} />
                </div>
        </Card.Content>
    </Card.Root>
</section>