dice = {}		// Associative array to keep track of number of each dice
hist = []

window.onload = function() {
	clearDice()

	sessionStorage.setItem('hist', hist)
}

/*
	Adds a dice to the roll
*/
function add(num) {
	// Check for user input, update dice array if valid
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
	Handles custom dice form submission
*/
$('document').ready(function() {
	$('#custForm').submit(function(e) {
		e.preventDefault()
		// console.log($('#custForm').serialize())

		var values = $(this).serialize()
		console.log(values)

		$('#cust-dice-modal').modal('hide')
	})

	// Make sure to focus on input when modal opens up
	$('.modal').on('shown.bs.modal', function() {
		$(this).find('input:first').focus()
	})
})

/*
	Removes a dice from the roll
*/
function rem(num) {
	// Check for user input, update dice array if valid
	curr = document.getElementById('amt' + num).innerText
	if (curr == '')
		dice[num] = 0
	else if (isNaN(curr))
		alert('Please input a whole number of d' + num)
	else
		dice[num] = parseInt(curr) - 1

	updateCounters()
	updateMainDisplay(diceToStr(dice))
}

function remCust() {
	// Check for user input, update dice array if valid
	amt = document.getElementById('amtCust').innerText
	size = document.getElementById('custSize').innerText
	if (amt == '')
		dice[size] = 0
	else if (isNaN(amt))
		alert('Please input a whole number of d' + size)
	else
		dice[size] = parseInt(amt) - 1

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
			document.getElementById('amt' + key).innerText = ''
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
			success: function(sum){
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
	dice = {4: 0,
			6: 0,
			8: 0,
			10: 0,
			12: 0,
			20: 0,
			100: 0}
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