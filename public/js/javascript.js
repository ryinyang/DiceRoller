const diceArray = new DiceArray()		// Object to keep track of number of each dice
const hist = []
const combos = []

// Initial load up the DiceModules 
function initDiceModules() {
	var init = [4, 6, 8, 10, 12, 20, 100]
	var row = $('#add-cust-btn').parent()
	var cust = $('#add-cust-btn').detach()
	var newDice = null

	// Add the common dice
	for (var size of init) {
		newDice = new DiceModule(size)
		diceArray.append(newDice)
		row.append(createDiceMarkup(size))

		// Create new row to fit
		if (row.children().length == 4) {
			$('#roll-btn-container').before(row)
			row = $('#d-flex-template').clone()
			row.attr('id', '')
		}
	}
	row.append(cust)
	$('#roll-btn-container').before(row)
}

// Increments the amount of a certain dice
function add(size) {
	// console.log('Adding a d' + size)
	var diceToUpdate = diceArray.get(size)

	// Update DiceModule Model
	diceToUpdate.increment()

	// Update DiceModule View
	$('#amt' + size).text(diceToUpdate.getAmount().toString())

	updateMainDisplay(diceArray.toString())
}

// Decrements the amount of a certain dice
function rem(size) {
	// console.log('Removing a d' + size)
	var diceToUpdate = diceArray.get(size)

	// Update DiceModule Model
	console.log(diceToUpdate.getAmount())
	if (diceToUpdate.getAmount() > 0) {
		diceToUpdate.decrement()
	}

	// Update DiceModule View
	$('#amt' + size).text(diceToUpdate.getAmount().toString())

	updateMainDisplay(diceArray.toString())
}


// Creates the markup of the dice
function createDiceMarkup(size) {
	newDice = $('#dice-module-template').clone()

	// Update the attributes
	newDice.attr('id', 'module' + size)
	newDice.find('#amt-template').attr('id', 'amt' + size)
	newDice.find('#rem-template').attr('id', 'rem' + size)
	newDice.find('#add-template').attr('id', 'add' + size)
	newDice.find('#size-text-template').html('d' + size)

	return newDice
}

function addCustDice() {
	console.log('addcust')
	$('#cust-dice-modal').modal('hide')

	var size = parseInt($('#cust-form input').val())

	// If size is new, add new dice to dice obj
	diceArray.append(size)

	// Create new dice
	var newDice = createDiceMarkup(size)

	// Put dice on page
	$('#add-cust-btn').before(newDice)

	// Move add-cust-btn
	var numUnique = diceArray.getLength()
	if (numUnique % 4 == 0) {
		var newRow = $('#d-flex-template').clone()
		newRow.attr('id', '')
		newRow.append($('#add-cust-btn'))
		$('#roll-btn-container').before(newRow)
	} else {
		newDice.after($('#add-cust-btn'))
	}
}

function updateMainDisplay(s) {
	if (s)
		document.getElementById('main-display').innerText = s
	else
		document.getElementById('main-display').innerText = 'Add some dice!'
}

// Updates the amount of each dice
function updateAmounts() {
	for (d of diceArray.toArray()) {
		var size = d.getSize()
		var amount = d.getAmount()
		$('#amt' + size).text(amount)
	}
}

/*
	Function that sends the dice array to server for rolling. Once server 
	returns the sum, update jumbo
*/
function rollDice() {
	if (!diceArray.isEmpty()) {
		// Send array of dice to server for rolling
		$.ajax({
			type: 'POST',
			url: '/roll',
			data: diceArray.toJSON(),
			success: function(sum) {
				// Success, update the jumbo with sum
				updateMainDisplay(diceArray.toString() + ' = ' + sum)

				// Update hist
				addToHist(diceArray, sum)
				showHist()
			},
			error: function(err){ alert('error'); },
			contentType: 'application/json'
	    })
	}

	else {
		updateMainDisplay('Nothing to roll, boss!')
	}
}

// Set all dice amounts to 0
function resetDice() {
	diceArray.reset()
	updateAmounts()
	updateMainDisplay()
}

/*
	Function to update the hist array
*/
function addToHist(diceArray, sum) {

	// Keep length of array fixed, otherwise, could run out of mem
	if (hist.length > 10) {
		hist.shift()
	}
	hist.push(diceArray.toString() + ' = ' + sum)
	sessionStorage.setItem('hist', JSON.stringify(hist))
}

function histToStr(hist) {
	txt = ''
	for (var i = hist.length-1; i >= 0; i--) {
		txt += hist[i] + '\n'
	}
	return txt
}

function showHist() {
	// $('#history-text').text(histToStr(hist))

}

function clearHist() {
	hist.length = 0
	$('#history-text').text('')
}

function saveCombo() {
	console.log('Adding combo')
	combos.push(diceArray)

	comboMarkup = $('#combo-template').clone()
	comboMarkup.attr('id', 'combo' + combos.length)

	$('#first-combo').text(diceArray.toString())
	console.log(diceArray)
}

// All the handler bindings
$('document').ready(function() {

	sessionStorage.setItem('hist', hist)

	initDiceModules()

	$('#reset-dice-btn').click(resetDice)

	// Add button handler
	$(document).on('click', '.rem', function(e) {
		// Get size from the id of buttons
		var size = e.target.id.slice(3)
		rem(size)
	})

	// Add button handler, this syntax binds to future elements
	$(document).on('click', '.add', function(e) {
		// Get size from the id of buttons
		var size = e.target.id.slice(3)
		add(size)
	})

	// Bind roll() to its button
	$('#roll-btn').click(rollDice)

	// Bind saveCombo() to its button
	$('#save-dice-btn').click(saveCombo)

	// Bind clearHist() to its button
	$('#clear-hist-btn').click(clearHist)

	// Handles custom dice form submission
	$('#cust-form').submit(function(e) {
		e.preventDefault()
		addCustDice()
	})

	// Make sure to focus on input when modal opens up
	$('.modal').on('shown.bs.modal', function() {
		$(this).find('input:first').focus()
	})

	$(document).on('click', '.load-button', function() {

	})
})