<header>
	<h1>Mar 2026</h1>
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
			<dd>50/50 <u>Edit</u></dd>
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
				<tr>
					<th scope="row">Rent</th>
					<td>1200</td>
				</tr>
				<tr>
					<th scope="row">Eneco</th>
					<td>100</td>
				</tr>
				<tr>
					<th scope="row">Water</th>
					<td>22</td>
				</tr>
				<tr>
					<th scope="row">Internet</th>
					<td>62</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<th scope="row">Total</th>
					<td>1384</td>
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
			<small>This will include all 4 expenses and the 50/50 split setting.</small>
		</form>
	</details>
	<hr />
</footer>
