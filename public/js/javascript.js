dice = {}		// Object to keep track of number of each dice
hist = []
savedCombos = []

// All the handler bindings
$('document').ready(function() {

	dice = {4: 0,
			6: 0,
			8: 0,
			10: 0,
			12: 0,
			20: 0,
			100: 0,}

	sessionStorage.setItem('hist', hist)

	loadDiceModules()

	$('#clear-dice-btn').click(clearDice)

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

	// Bind addCombo() to its button
	$('#save-dice-btn').click(addCombo)

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

function addCustDice() {
	console.log('addcust')
	$('#cust-dice-modal').modal('hide')

	var size = parseInt($('#cust-form input').val())

	// If size is new, add new dice to dice obj
	if (!(size in dice)) {
		dice[size] = 0
	} else {
		return
	}

	// Create new dice
	var newDice = createDice(size)

	// Put dice on page
	$('#add-cust-btn').before(newDice)

	// Move add-cust-btn
	var numUnique = Object.keys(dice).length
	if (numUnique % 4 == 0) {
		console.log('cloned')
		var newRow = $('#d-flex-template').clone()
		newRow.attr('id', '')
		newRow.append($('#add-cust-btn'))
		$('#roll-btn-container').before(newRow)
	} else {
		newDice.after($('#add-cust-btn'))
	}

	// $('#cust-size-input').val('')
}

function loadDiceModules() {
	var row = $('#add-cust-btn').parent()
	var cust = $('#add-cust-btn').detach()
	for (size in dice) {
		newDice = createDice(size)
		row.append(newDice)
		if (row.children().length == 4) {
			$('#roll-btn-container').before(row)
			row = $('#d-flex-template').clone()
			row.attr('id', '')
			// row.append($('#add-cust-btn'))
		}
	}
	row.append(cust)
	$('#roll-btn-container').before(row)
}

// Creates the markup of the dice
function createDice(size) {
	newDice = $('#dice-module-template').clone()

	// Update the attributes
	newDice.attr('id', 'module' + size)
	newDice.find('#amt-template').attr('id', 'amt' + size)
	newDice.find('#rem-template').attr('id', 'rem' + size)
	newDice.find('#add-template').attr('id', 'add' + size)
	newDice.find('#size-text-template').html('d' + size)

	return newDice
}

/*
	Adds a dice to the roll
*/
function add(num) {
	// Check for user input, update dice array if valid
	console.log(num)
	curr = document.getElementById('amt' + num).innerText
	if (curr == '')
		dice[num] += 1
	else if (isNaN(curr))
		alert('Please input a whole number of d' + num)
	else
		dice[num] = parseInt(curr) + 1

	updateCounters()
	updateMainDisplay(diceToStr(dice))
}

/*
	Removes a dice from the roll
*/
function rem(num) {
	// Check for user input, update dice array if valid
	curr = document.getElementById('amt' + num).innerText
	if (curr == '0')
		dice[num] = 0
	else if (isNaN(curr))
		alert('Please input a whole number of d' + num)
	else
		dice[num] = parseInt(curr) - 1

	updateCounters()
	updateMainDisplay(diceToStr(dice))
}

/*
	Looks at dice array and then updates the numbers on page
*/
function updateCounters() {
	// Loop through dice and update each input value
	for (var key in dice) {
		if (dice[key] != 0)
			document.getElementById('amt' + key).innerText = parseInt(dice[key])
		else
			document.getElementById('amt' + key).innerText = '0'
	}
}

function updateMainDisplay(s) {
	if (s)
		document.getElementById('main-display').innerText = s
	else
		document.getElementById('main-display').innerText = 'Add some dice!'

}

function diceToStr(dice) {
	txt = ''
	for (var key in dice) {
		if (dice[key]) {
			if (txt) {
				txt += ' + ' + dice[key] + 'd' + key
			} else {
				txt += dice[key] + 'd' + key
			}
		}
	}

	return txt
}

/*
	Helper function to see if there are any dice to roll
*/
function hasDice(){
	for (var key in dice) {
		if (dice[key] > 0) {
			return true
		}
	}
	return false
}

/*
	Function that sends the dice array to server for rolling once server 
	returns the sum, update jumbo
*/
function rollDice() {

	console.log('roll')
	nums = [4, 6, 8, 10, 12, 20, 100]
	for (var i = nums.length - 1; i >= 0; i--) {
		num = nums[i]
		curr = document.getElementById('amt' + num).innerText
		if (curr == '') {
			dice[num] = 0
		}
		else if (isNaN(curr)) {
			alert('Please input a whole number of d' + num)
			updateCounters()
			updateMainDisplay()
			updateMainDisplay(diceToStr(dice))
			return
		}
		else {
			dice[num] = parseInt(curr)
		}
	}


	if (hasDice()) {
		// Send array of dice to server for rolling
		$.ajax({
			type: 'POST',
			url: '/roll',
			data: JSON.stringify(dice),
			success: function(sum) {
				// Success, update the jumbo with sum
				// console.log(sum)
				updateMainDisplay(diceToStr(dice) + ' = ' + sum)

				// Update hist
				addToHist(dice, sum)
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

function clearDice() {
	for (size in dice) {
		dice[size] = 0
	}
	updateMainDisplay()
	updateCounters()
}

/*
	Function to update the hist array
*/
function addToHist(dice, sum) {

	// Keep length of array fixed, otherwise, could run out of mem
	if (hist.length > 10) {
		hist.shift()
	}
	hist.push(diceToStr(dice) + ' = ' + sum)
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
	document.getElementById('history-text').innerText = histToStr(hist)
}

function clearHist() {
	hist = []
	document.getElementById('history-text').innerText = ''
}

function addCombo() {
	console.log('Adding combo')
	savedCombos.push(dice)
	$('#first-combo').text(diceToStr(dice))
	console.log(dice)
}