<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        const pagefind = await import('/pagefind/pagefind.js');
        console.log(await pagefind.search('sveltekit'));
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
