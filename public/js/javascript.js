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
	// console.log('adding a d' + num)

	// Get current input
	curr = parseInt(document.getElementById('amt' + num).value)

	// If not a number, continue where we left off
	if (!isNaN(curr) && curr > 0) {
		dice[num] = curr + 1
	}
	else {
		dice[num]++
	}
	updateCounters()
	updateJumbo()
	updateJumbo(diceToStr(dice))
	// console.log(dice)
}

/*
	Removes a dice from the roll
*/
function rem(num) {
	// console.log('removing a d' + num)

	// Get current input
	curr = parseInt(document.getElementById('amt' + num).value)

	// If not a number, continue where we left off
	if (curr > 0) {
		if (!isNaN(curr) && curr > 0) {
			dice[num] = curr - 1
		}
		else {
			dice[num]--
		}
	}
	updateCounters()
	updateJumbo(diceToStr(dice))
	// console.log(dice)
}

/*
	Looks at dice array and then updates the numbers on page
*/
function updateCounters() {
	// Loop through dice and update each input value
	for (var key in dice) {
		if (dice[key])
			document.getElementById('amt' + key).value = parseInt(dice[key])
		else
			document.getElementById('amt' + key).value = null
	}
}

function updateJumbo(s) {
	document.getElementById('jumbo').innerText = s

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
	if (hasDice()) {
		// Send array of dice to server for rolling
		$.ajax({
			type: "POST",
			url: '/roll',
			data: JSON.stringify(dice),
			success: function(sum){
				// Success, update the jumbo with sum
				// console.log(sum)
				updateJumbo(diceToStr(dice) + ' = ' + sum)

				// Update hist
				addToHist(dice, sum)
				showHist()
			},
			error: function(err){ alert('error'); },
			contentType: "application/json"
	    })
	}

	else {
		updateJumbo('Nothing to roll, boss!')
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
	updateJumbo('Add some dice!')
	updateCounters()
}

/*
	Function to update the hist array
*/
function addToHist(dice, sum) {

	// Keep length of array fixed, otherwise, could run out of mem
	if (hist.length > 50) {
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