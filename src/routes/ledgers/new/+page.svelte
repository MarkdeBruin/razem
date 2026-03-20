<header><h1>New ledger</h1></header>

<main>
	<form action="">
		<label>
			<span>Ledger name</span>
			<input type="text" required />
		</label>

		<fieldset>
			<legend>Choose a template</legend>
				<label>
					<input type="radio" id="blank" name="template" value="blank" checked />
					Blank ledge
				</label>

				<label>
					<input type="radio" id="monthly-expenses" name="template" value="monthly-expenses" />
					Monthly expenses
				</label>

				<label>
					<input type="radio" id="holidays" name="template" value="holidays" />
					Holidays
				</label>
		</fieldset>
		
		<small>You can add new templates via ledger detail pages.</small>


		<input type="submit" value="Add ledger" />
	</form>
</main>
