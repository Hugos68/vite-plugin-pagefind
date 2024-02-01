<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        const pagefind = await import('/pagefind/pagefind.js');
        const r = await pagefind.search('sveltekit');
        for (const result of r.results) {
            console.log(await result.data());
        }
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
