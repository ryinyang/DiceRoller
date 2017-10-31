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

function rollDice() {
	sum = 0
	for (size in dice) {
		num = dice[size]
		for (i = 0; i < num; i++) {
			sum += Math.floor(Math.random() * size) + 1
		}
	}
	console.log(sum)
	updateJumbo(' = ' + sum)
}