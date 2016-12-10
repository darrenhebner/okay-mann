const choo = require('choo')
const app = choo()
const html = require('choo/html')
const http = require('choo/http')
const nav = require('./components/nav')

const store = {
  getAll: (name, cb) => {
    fetch('http://api.bandsintown.com/artists/weezer/events.json?callback=?&app_id=ramdesh')
      .then(data => data.json())
      .then(data => cb(data))
  }
}

app.model({
  state: {
    tourDates: []
  },
  reducers: {
    receiveTourDates: (data, state) => {
      return { tourDates: data }
    }
  },
  effects: {
    getTourDates: (data, state, send, done) => {
      store.getAll('dates', (dates) => {
        send('receiveTourDates', dates, done)
      })
    },
    toggleMenu: (data, state, send, done) => {
      const body = document.body
      body.classList.toggle("nav-visible")
    }
  }
})

const navButton = (send) => html`
  <button class="menu-button" onclick=${e => send('toggleMenu')}>Menu</button>
`

const homeView = (state, prev, send) => {
  document.body.className = "home"

  return html`
    <div>
      <main>
        <a href="/"><img class="logo" src="img/logo.png"/></a>
        <h1 class="hero-logo">Okay Mann</h1>
        <div class="hero"></div>
      </main>
      ${ navButton(send) }
      ${ nav }  
    </div>`
}

const aboutView = (state, prev, send) => {
  document.body.className = "about"

  return html`
    <div>
      <main>
        <a href="/"><img class="logo" src="img/logo.png"/></a>
        <div class="bio-image"></div>
        <div class="bio">
          <h2>Biography</h2>
          <p>5'11", 130 lbs, and eyes like his father; meet Katlin Mathison - otherwise known as Okay Mann.</p>
          <p>Katlin upholds the indie folk tradition of the rolling stone. 4 years of session work, relentless travel, and a mentorship with Paul McCartney, and a gold single in Norway have eventually led him back to the harsh winters of Manitoba, Canada.</p>
          <p>A year later, Katlin is ready to hit the road again. Armed with a new monicker and a suitcase of songs born of a Winnipeg winter, Mathison is heading back to the cobblestone streets of Liverpool, OK to record his debut release.</p>
          <p>Listen for honest music that worships the hook, but keeps thoughtful lyrics front and centre. Melodies that remind you of The Tallest Man on Earth and James Bay, but never quite in a way that you'd expect.</p>
          <p>His is the story of a nomad held down by heatbreak and circumstance. It's been a tough year, but he's Okay Mann.</p>
      <small>email</small>
      <a href="mailto:okaymannmusic@gmail.com">okaymannmusic@gmail.com</a> 
    </div>
  </main>
     ${ navButton(send) }
     ${ nav }
    </div>    
  `
}

const tourView = (state, prev, send) => {
  document.body.className = "about"

  return html`
    <main onload=${() => send('getTourDates')}>
      <div class="progress-bar"></div>
      <div class="portrait"></div>
      <div class="tour-dates">
        <ul>
          ${state.tourDates.map(date => html`<li>${date.first}</li>`)}
        </ul>
      </div>
    </main>`
}

app.router('/', (route) => [
  route('/', homeView, [
    route('/about', aboutView),
    route('/tour', tourView)
  ])
])

const tree = app.start()
document.body.appendChild(tree)
