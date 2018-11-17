// DiceArray class maintains the list of DiceModule objects. 
// Makes sure that each DiceModule is unique.
function DiceArray() {
	this.data = []
	this.seen = new Set()

	// Add to end of data
	this.append = function(newDice) {
		if (newDice instanceof DiceModule) {
			sz = newDice.getSize()
			if (!this.seen.has(sz)) {
				this.data.push(newDice)
				this.seen.add(sz)
			}
		} else {
			sz = newDice
			if (!this.seen.has(sz)) {
				this.data.push(new DiceModule(sz))
				this.seen.add(sz)
			}
		}
	}

	// Add to beginning of data
	this.prepend = function(newDice) {
		if (newDice instanceof DiceModule) {
			sz = newDice.getSize()
			if (!this.seen.has(sz)) {
				this.data.unshift(newDice)
				this.seen.add(sz)
			}
		} else {
			sz = newDice
			if (!this.seen.has(sz)) {
				this.data.unshift(new DiceModule(sz))
				this.seen.add(sz)
			}
		}
	}

	// Set all amounts to 0
	this.reset = function() {
		for (var i in this.data) {
			this.data[i].setAmount(0)
		}
	}

	this.get = function(size) {
		for (var i in this.data) {
			var d = this.data[i]
			if (d.getSize() == size) {
				return d
			}
		}
		return null
	}

	this.toString = function(verbose=false) {
		var txt = ''
		var d = null

		for (var i in this.data) {
			d = this.data[i]
			if ((d.getAmount() != 0) || verbose) {
				if (txt) {
					txt += ' + ' + d.toString(verbose)
				} else {
					txt += d.toString(verbose)
				}
			}
		}
		return txt
	}

	this.isEmpty = function() {
		for (var i in this.data) {
			var d = this.data[i]
			if (d.getAmount())
				return false
		}
		return true
	}

	this.getLength = function() {
		return this.data.length
	}

	this.toJSON = function() {
		var ret = {}
		for (d of this.data) {
			ret[d.getSize()] = d.getAmount()
		}
		return JSON.stringify(ret)
	}

	this.toArray = function() {
		return this.data
	}

	this.has =function(size) {
		return this.seen.has(size)
	}

	this.fromString = function(s) {
		var dice = s.split(' + ')

		// Clear properties
		this.data = []
		this.seen = new Set()

		for (var d of dice) {
			var num = d.split('d')[0]
			var size = d.split('d')[1]
			this.append(new DiceModule(size, num))
		}
	}
}