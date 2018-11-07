// DiceArray class maintains the list of DiceModule objects. 
// Makes sure that each DiceModule is unique.
function DiceArray() {
	this.array = []
	this.seen = new Set()

	// Add to end of array
	this.append = function(newDice) {
		if (newDice instanceof DiceModule) {
			sz = newDice.getSize()
			if (!this.seen.has(sz)) {
				this.array.push(newDice)
				this.seen.add(sz)
			}
		} else {
			sz = newDice
			if (!this.seen.has(sz)) {
				this.array.push(new DiceModule(sz))
				this.seen.add(sz)
			}
		}
	}

	// Add to beginning of array
	this.prepend = function(newDice) {
		if (newDice instanceof DiceModule) {
			sz = newDice.getSize()
			if (!this.seen.has(sz)) {
				this.array.unshift(newDice)
				this.seen.add(sz)
			}
		} else {
			sz = newDice
			if (!this.seen.has(sz)) {
				this.array.unshift(new DiceModule(sz))
				this.seen.add(sz)
			}
		}
	}

	// Set all amounts to 0
	this.reset = function() {
		for (var i in this.array) {
			this.array[i].setAmount(0)
		}
	}

	this.get = function(size) {
		for (var i in this.array) {
			var d = this.array[i]
			if (d.getSize() == size) {
				return d
			}
		}
		return null
	}

	this.toString = function() {
		var txt = ''
		var d = null

		for (var i in this.array) {
			d = this.array[i]
			if (d.getAmount()) {
				if (txt) {
					txt += ' + ' + d.toString()
				} else {
					txt += d.toString()
				}
			}
		}
		return txt
	}

	this.isEmpty = function() {
		for (var i in this.array) {
			var d = this.array[i]
			if (d.getAmount())
				return false
		}
		return true
	}

	this.getLength = function() {
		return this.array.length
	}

	this.toJSON = function() {
		var ret = {}
		for (d of this.array) {
			ret[d.getSize()] = d.getAmount()
		}
		return JSON.stringify(ret)
	}

	this.toArray = function() {
		return this.array
	}
}