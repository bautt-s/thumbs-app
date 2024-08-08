<script lang='ts'>
    import * as Avatar from '$lib/components/ui/avatar';
    import * as Dialog from '$lib/components/ui/dialog';
    import IconLink from '~icons/ri/link'
    import IconRightArrow from '~icons/ep/arrow-right'
    import IconGoogle from '~icons/mage/google'
    import IconYelp from '~icons/fa/yelp'
	import { getLuminance } from '$lib/_helpers/getLuminance.js';
    import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

    export let data
    
    const { linkTree, location } = data
    let googleLink, yelpLink, image, otherLinks, luminance: number

    if (linkTree) {
        googleLink = linkTree.googleLink
        yelpLink = linkTree.yelpLink
        image = linkTree.image
        otherLinks = linkTree.otherLinks

        luminance = getLuminance(linkTree.color || '#00000')
    }

    let copy = false

    const urlToClipboard = () => {
        navigator.clipboard.writeText(document.URL);
        copy = true
        setTimeout(() => copy = false, 1000);
    }

    const handleClick = (event: MouseEvent, href: string | null, target: string) => {
        if (href) {
            event.preventDefault();

            logClickAnalytics(href);
    
            if (target === "_blank") window.open(href, "_blank");
            else window.location.href = href;
        }
    };

    const logClickAnalytics = (url: string) => {
        console.log(`Link clicked: ${url}`)
    };

    let googleHover = false
    let yelpHover = false
    let tripAdvisorHover = false
</script>

<svelte:head>
    <title>
        {((location?.name && linkTree?.visible) ? location?.name : 'Not found') + ' | Links'}
    </title>
</svelte:head>

<section class="h-screen w-screen flex justify-center px-8 md:px-0" 
style={`background-color: ${linkTree?.visible ? linkTree?.color : 'white'}`}>
    {#if (!linkTree || !linkTree.visible)}
    <div class="flex flex-col items-center w-full md:w-2/3 xl:w-1/3 my-auto">
        <h1 class="text-3xl font-extrabold leading-tight tracking-tighter">
            Oops! This page doesn't exist :/
        </h1>

        <span class="text-gray-500 mt-3">
            Seems like you got stuck...
        </span>

        <a href="/home" class="w-2/3 mt-6 flex">
            <Button class="w-full">
                Go to home
            </Button>
        </a>
    </div>
    {:else}
    <div class="flex flex-col gap-y-4 items-center w-full md:w-2/3 xl:w-1/3 py-8">
        <nav class="w-full">
            <Dialog.Root>
                <Dialog.Trigger class={`rounded-full w-10 h-10 relative text-xl font-bold
                ${luminance > 0.5 ? 'bg-neutral-800 text-white' : 'bg-white'}`}>
                    <span class="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
                        ...
                    </span>
                </Dialog.Trigger>

                <Dialog.Content>
                    <div>
                        <span class="font-semibold text-lg">Join Thumbs!</span>
                        <p class="text-sm text-gray-500">
                            A platform to get people to know your business.
                        </p>

                        <div class="flex flex-col mt-4">
                            <button class="flex flex-row items-center hover:bg-gray-100 py-2 px-2 rounded-xl" 
                            on:click={() => urlToClipboard()}>
                                <div class="flex flex-row gap-x-3 items-center">
                                    <span class="bg-gray-300 rounded-full flex items-center justify-center p-2">
                                        <IconLink class="text-gray-600 text-sm" />
                                    </span>

                                    <span class="font-semibold">
                                        {!copy ? 'Copy link' : 'Copied!'}
                                    </span>
                                </div>
                                <IconRightArrow class="flex ml-auto" />
                            </button>
                        </div>

                        <div class="flex flex-row gap-x-4 w-full mt-4">
                            <Button class='w-full' on:click={() => goto('/auth/sign-up')}>
                                Sign up free
                            </Button>

                            <Button variant="outline" class='w-full' on:click={() => goto('/')}>
                                Find out more
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Root>
        </nav>

        <Avatar.Root class="h-20 w-20 flex items-center justify-center">
            <Avatar.Fallback class="text-3xl font-semibold text-gray-700">
                {location.name[0]}
            </Avatar.Fallback>
        </Avatar.Root>

        <h1 class={`font-bold text-xl ${luminance > 0.5 ? 'text-neutral-800' : 'text-white'}`}>
            {location.name}
        </h1>

        {#if !linkTree.googleLink && !linkTree.yelpLink && !linkTree.otherLinks}
            <span>Seems like this tree is empty!</span>
        {/if}

        <div class="flex flex-col w-full gap-y-4 mt-4">
            {#if linkTree.googleLink}
                <button on:click={(e) => handleClick(e, linkTree.googleLink, '_blank')}
                class={`flex flex-row items-center w-full border-2 group px-4 py-4 duration-300 
                rounded-lg transition-all ${luminance > 0.5 ? 'hover:border-neutral-800' : 'hover:border-white'}`}
                on:mouseover={() => googleHover = true} on:mouseout={() => googleHover = false}
                style={`background-color: ${googleHover ? linkTree.color : (luminance > 0.5 ? '#262626' : 'white')}`} 
                on:blur={() => null} on:focus={() => null}>
                    <IconGoogle class="text-xl left-2 relative" 
                    style={!googleHover ? `color: ${linkTree?.color}` 
                    : (luminance > 0.5 ? 'color: #262626' : 'color: white')} />
    
                    <span class={`flex mx-auto leading-tight tracking-tighter text-lg font-semibold
                    ${luminance < 0.5 ? 'text-neutral-800 group-hover:text-white' 
                    : 'text-white group-hover:text-neutral-800'}`}>
                        Review us on Google!
                    </span>
                </button>
            {/if}

            {#if linkTree.yelpLink}
                <button on:click={(e) => handleClick(e, linkTree.yelpLink, '_blank')}
                class={`flex flex-row items-center w-full border-2 group px-4 py-4 duration-300
                rounded-lg transition-all ${luminance > 0.5 ? 'hover:border-neutral-800' : 'hover:border-white'}`}  
                on:mouseover={() => yelpHover = true} on:mouseout={() => yelpHover = false} 
                style={`background-color: ${yelpHover ? linkTree.color : (luminance > 0.5 ? '#262626' : 'white')}`} 
                on:blur={() => null} on:focus={() => null}>
                    <IconYelp class="text-xl left-2 relative"
                    style={!yelpHover ? `color: ${linkTree?.color}` 
                    : (luminance > 0.5 ? 'color: #262626' : 'color: white')} />
    
                    <span class={`flex mx-auto leading-tight tracking-tighter text-lg font-semibold
                    ${luminance < 0.5 ? 'text-neutral-800 group-hover:text-white' 
                    : 'text-white group-hover:text-neutral-800'}`}>
                        Review us on Yelp!
                    </span>
                </button>
            {/if}

            {#if linkTree.tripAdvisorLink}
                <button on:click={(e) => handleClick(e, linkTree.tripAdvisorLink, '_blank')}
                class={`flex flex-row items-center w-full border-2 group px-4 py-4 duration-300
                rounded-lg transition-all ${luminance > 0.5 ? 'hover:border-neutral-800' : 'hover:border-white'}`}  
                on:mouseover={() => tripAdvisorHover = true} on:mouseout={() => tripAdvisorHover = false} 
                style={`background-color: ${tripAdvisorHover ? linkTree.color : (luminance > 0.5 ? '#262626' : 'white')}`} 
                on:blur={() => null} on:focus={() => null}>
                    <IconYelp class="text-xl left-2 relative"
                    style={!tripAdvisorHover ? `color: ${linkTree?.color}` 
                    : (luminance > 0.5 ? 'color: #262626' : 'color: white')} />
    
                    <span class={`flex mx-auto leading-tight tracking-tighter text-lg font-semibold
                    ${luminance < 0.5 ? 'text-neutral-800 group-hover:text-white' 
                    : 'text-white group-hover:text-neutral-800'}`}>
                        Review us on Trip Advisor!
                    </span>
                </button>
            {/if}
        </div>
    </div>
    {/if}   
</section>