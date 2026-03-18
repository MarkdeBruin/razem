<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const totalExpenses = $derived(data.expenses.reduce((sum, expense) => sum + expense.amount, 0));

	function formatSplit(ownerFraction: number): string {
		const owner = Math.round(ownerFraction * 100);
		const partner = 100 - owner;
		
		return `${owner}/${partner}`;
	}
</script>

<header>
	<h1>{data.ledger.name}</h1>
</header>

<main>
	<section class="grid">
		<dl>
			<dt>Balance Mark</dt>
			<dd>+ €692</dd>
		</dl>
		<dl>
			<dt>Balance Anna</dt>
			<dd>-€692</dd>
		</dl>
		<dl>
			<dt>Split Mark/Anna</dt>
			<dd>{formatSplit(data.ledger.ownerFraction)} <u>Edit</u></dd>
		</dl>
	</section>

	<section>
		<form action="">
			<fieldset class="grid">
				<input type="text" placeholder="Description" required />

				<input type="number" placeholder="Amount" min="1" required />
				<input type="submit" value="Add expense" />
			</fieldset>
		</form>
	</section>

	<section>
		<fieldset>
			<legend>Filter expenses</legend>
			<input type="radio" id="all" name="expenses" checked />
			<label for="all">All</label>
			<input type="radio" id="owner" name="expenses" />
			<label for="owner">Mark’s</label>
			<input type="radio" id="partner" name="expenses" />
			<label for="partner">Anna’s</label>
		</fieldset>
	</section>

	<section class="overflow-auto">
		<table>
			<thead>
				<tr>
					<th scope="col">Expense</th>
					<th scope="col">Amount (€)</th>
				</tr>
			</thead>
			<tbody>
				{#each data.expenses as expense}
					<tr>
						<th scope="row">{expense.description}</th>
						<td>{expense.amount}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th scope="row">Total</th>
					<td>{totalExpenses}</td>
				</tr>
			</tfoot>
		</table>
	</section>
</main>

<footer>
	<details name="example">
		<summary><strong>Turn ledger into template</strong></summary>
		<form action="">
			<fieldset class="grid">
				<input type="text" placeholder="Name" required />

				<input type="submit" value="Create template" />
			</fieldset>
			<small
				>This will include all {data.expenses.length} expenses and the {formatSplit(data.ledger.ownerFraction)} split setting.</small
			>
		</form>
	</details>
	<hr />
</footer>
