<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta
		name="description"
		content="Thumbs -- An easy way for clients to review and rank their favourite restaurants!"
	/>
</svelte:head>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-2">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{APP_NAME}
			</h1>

			<p class="max-w-[700px] text-lg text-muted-foreground">
				An easy way for clients to review and rank their favourite restaurants!
				<br /> Some more text will be here, eventually.
			</p>
		</div>
	</section>
</div>
