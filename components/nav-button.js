const choo = require('choo')
const app = choo()
const html = require('choo/html')

const navButton = html`
  <button class="menu-button">Menu</button>
`

module.exports = navButton;
