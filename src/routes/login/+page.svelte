<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<header class="header--logo">
	<svg
		width="108"
		height="86"
		viewBox="0 0 108 86"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="32" cy="10" r="10" />
		<circle cx="76" cy="10" r="10" />
		<circle cx="10" cy="32" r="10" />
		<circle cx="32" cy="32" r="10" />
		<circle cx="54" cy="32" r="10" />
		<circle cx="76" cy="32" r="10" />
		<circle cx="98" cy="32" r="10" />
		<circle cx="32" cy="54" r="10" />
		<circle cx="54" cy="54" r="10" />
		<circle cx="76" cy="54" r="10" />
		<circle cx="54" cy="76" r="10" />
	</svg>
</header>

<main>
	<form method="POST" use:enhance>
		<h1>Log in</h1>
		<label>
			Email
			<input type="email" name="email" required autocapitalize="none" />
		</label>

		<label>
			Password
			<input type="password" name="password" required autocapitalize="none" />
		</label>

		<button class="btn" type="submit"><span>Log in</span></button>
	</form>
</main>
