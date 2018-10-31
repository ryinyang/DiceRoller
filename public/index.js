const e = React.createElement;

class DiceModule extends React.Component {
	render() {
		return e(
			<div class='col-md p-0'>
                  <div class='card border-0'>
                    <div class='dice-group m-1 py-3 px-2'>
                      <i class="fa fa-minus-square rem spin" id='rem4' onclick='rem(4)'></i>
                      <span class='amt' contenteditable="true" id='amt4'>0</span><span>d4</span>
                      <i class="fa fa-plus-square add spin" id='add4' onclick='add(4)'></i>
                    </div>
                  </div>
                </div>
		)
	}
}

ReactDOM.render(
	<DiceModule />,
	document.getElementById('dice_module_container')
)