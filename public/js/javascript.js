dice = {}		// Associative array to keep track of number of each dice

window.onload = function() {
	dice = {4: 0,
			6: 0,
			8: 0,
			10: 0,
			12: 0,
			20: 0,
			100: 0}
}

/*
	Adds a dice to the roll
*/
function add(num) {
	console.log('adding a d' + num)
	dice[num]++
	updateCounters()
	updateJumbo()
	console.log(dice)
}

/*
	Removes a dice from the roll
*/
function rem(num) {
	console.log('removing a d' + num)

	if (dice[num] > 0) {
		dice[num]--
	}
	updateCounters()
	updateJumbo()
	console.log(dice)
}

/*
	Looks at dice array and then updates the numbers on page
*/
function updateCounters() {
	for (var key in dice) {
		if (dice[key]) {
			document.getElementById('amt' + key).innerText = dice[key] + 'd' + key
		} else {
			document.getElementById('amt' + key).innerText = 'd' + key
		}
	}
}

function updateJumbo(s) {
	txt = ''
	for (var key in dice) {
		if (dice[key]) {
			if (txt) {
				txt += ' + ' + dice[key] + 'd' + key
			} else {
				txt += dice[key] + 'd' + key
			}
		}
		if (s)
			document.getElementById('jumbo').innerText = txt + s
		else
			document.getElementById('jumbo').innerText = txt
	}
}

/*
	Function that sends the dice array to server for rolling once server 
	returns the sum, update jumbo
*/
function rollDice() {
	// Send array of dice to server for rolling
	$.ajax({
		type: "POST",
		url: '/roll',
		data: JSON.stringify(dice),
		success: function(sum){
			// Success, update the jumbo with sum
			console.log(sum)
			updateJumbo(' = ' + sum)
		},
		error: function(err){ alert('error'); },
		contentType: "application/json"
    })
}
