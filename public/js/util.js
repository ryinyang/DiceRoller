// Creates the markup of the dice
function createDice(size) {
	newDice = $('#dice-input-template').clone()

	// Update the attributes
	newDice.attr('id', '')
	newDice.find('#amt-template').attr('id', 'amt' + size)
	newDice.find('#rem-template').attr('id', 'rem' + size)
	newDice.find('#add-template').attr('id', 'add' + size)
	newDice.find('#size-text-template').html('d' + size)

	return newDice
}