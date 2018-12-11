const diceArray = new DiceArray()		// Object to keep track of number of each dice
const hist = []
const trays = []

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
	var amt = diceToUpdate.getAmount().toString()
	var size = diceToUpdate.getSize().toString()
	$('#amt' + size).text(amt + 'd' + size)

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
	var amt = diceToUpdate.getAmount().toString()
	var size = diceToUpdate.getSize().toString()
	$('#amt' + size).text(amt + 'd' + size)

	updateMainDisplay(diceArray.toString())
}

// Creates the markup of the dice
function createDiceMarkup(size, amount=0) {
	var newDice = $('#dice-module-template').clone()

	amount = parseInt(amount)

	// Update the attributes
	newDice.attr('id', 'module' + size)
	newDice.find('#amt-template').attr('id', 'amt' + size)
	newDice.find('#rem-template').attr('id', 'rem' + size)
	newDice.find('#add-template').attr('id', 'add' + size)
	newDice.find('#amt' + size).text(amount + 'd' + size) 

	return newDice
}

function addCustDice() {
	console.log('addcust')
	$('#cust-dice-modal').modal('hide')

	var size = parseInt($('#cust-form input').val())

	$('#cust-form input').val('')
	console.log($('#cust-form input').val())

	// If size is new, add new dice to dice obj
	if (diceArray.has(size)) {
		$("#module" + size).effect("highlight", {}, 3000);
		return
	}
	diceArray.append(size)

	// Create new dice
	var newDice = createDiceMarkup(size)

	// Put dice on page
	$('#add-cust-btn').before(newDice)

	// Move add-cust-btn
	var numUnique = diceArray.getLength()
	console.log(numUnique)
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
	for (var d of diceArray.toArray()) {
		console.log(d)
		var size = d.getSize()
		var amount = d.getAmount()
		$('#amt' + size).text(amount + 'd' + size)
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
				updateHist(diceArray, sum)
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

// Function to update the hist array and update markup
function updateHist(diceArray, sum) {

	var histLimit = 256

	// Update hist array
	// Keep length of array fixed, otherwise, could run out of mem
	if (hist.length > histLimit) {
		hist.shift()
	}
	hist.push(diceArray.toString() + ' = ' + sum)
	sessionStorage.setItem('hist', JSON.stringify(hist))
	
	// Update view
	var entry = $('#hist-entry-template').clone()
	entry.attr('id', '')
	entry.text(diceArray.toString() + ' = ' + sum)
	$('#hist-list').prepend(entry)

	// Don't show too many 
	if ($('#hist-list').children().length > histLimit) {
		$('#hist-list').children().last().remove()
	}
}

function clearHist() {
	hist.length = 0
	// $('#history-text').text('')
}

function saveTray() {
	if (diceArray.isEmpty()) {
		return
	}

	// Check for duplicate
	for (var t of trays) {
		if (t == diceArray.toString()) {
			console.log('dupe')
			return
		}
	}

	// Update trays array
	trays.push({'short': diceArray.toString(),
				'long': diceArray.toString(true)})

	// Update view/markup
	var tray = $('#tray-save-template').clone(true, true)
	tray.attr('id', diceArray.toString())
	tray.find('.d-inline').text(diceArray.toString())
	$('#tray-container').append(tray)
}

function loadTray(id) {
	for (var t of trays) {
		if (t['short'] == id) {
			break
		}
	}

	// Update diceArray
	diceArray.fromString(t['long'])

	// Update markup
	// var row = $('#add-cust-btn').parent()
	var cust = $('#add-cust-btn').detach()
	// var roll_btn_container = $('#roll-btn-container').detach()

	// Remove all existing DiceModules
	var row = $('#dice-container .d-flex:nth-child(2)')
	row.nextAll('.d-flex').remove()
	row.children().remove()

	// Add new ones back in
	for (var d of diceArray.toArray()) {
		var size = d.getSize()
		var amount = d.getAmount()

		row.append(createDiceMarkup(size, amount))

		// Create new row to fit
		if (row.children().length == 4) {
			$('#roll-btn-container').before(row)
			row = $('#d-flex-template').clone()
			row.attr('id', '')
		}
	}
	row.append(cust)
	$('#roll-btn-container').before(row)

	updateMainDisplay(diceArray.toString())
}

// All the handler bindings
$('document').ready(function() {

	sessionStorage.setItem('hist', hist)

	initDiceModules()

	$('#clear-display-btn').click(function () {
		updateMainDisplay('Cleared!')
	})

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

	$(document).on('click', '.load-btn', function(e) {
		var id = e.target.id
		loadTray(id)
	})

	// Bind roll() to its button
	$('#roll-btn').click(rollDice)

	// Bind saveCombo() to its button
	$('#save-tray-btn').click(saveTray)

	// Bind clearDice() to its button
	$('#reset-dice-btn').click(resetDice)

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