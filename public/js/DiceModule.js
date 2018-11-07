// DiceModule class maintains a single dice's amount and size
function DiceModule(sz, amt=0) {
	this.size = sz
	this.amount = amt
	this.id = ''

	// Returns the size
	this.getSize = function() {return this.size}

	// Changes the size
	this.setSize = function(sz) {this.size = sz}

	// Returns the amount
	this.getAmount = function() {return this.amount}

	// Changes the amount
	this.setAmount = function(amt) {this.amount = amt}
	this.increment = function() {this.amount++}
	this.decrement = function() {this.amount--}

	// Returns the DOM id of this DiceModule
	this.getId = function() {return this.id}

	// Changes the DOM id of this DiceModule
	this.setId = function(id) {this.id = id}

	this.toString = function() {
		return this.amount + 'd' + this.size
	}
}