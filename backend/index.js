const bodyParser = require('body-parser')
const express = require('express')
const geolib = require('geolib')
const path = require('path')
const imageprocess = require('./imageprocess')
const store = require('./store')
const PORT = process.env.PORT || 5000

const DEFAULT_RADIUS = 5000

store.setUpListeners()


express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/spots', (req, res) => {
    const radius = parseInt(req.query.radius) || DEFAULT_RADIUS
    const area = {
      latitude: parseFloat(req.query.lat) || 0.0,
      longitude: parseFloat(req.query.lon) || 0.0
    }
    console.log(Date.now(), '/spots', area, radius)

    if (!req.query.lat || !req.query.lon) {
      res.send(store.spots)
    } else {
      const spots = store.spots.filter(spot => geolib.getDistance(spot, area) < radius)
      if (spots.length > 0 && store.spotTaken) {
        res.send(spots.slice(1))
      } else {
        res.send(spots)
      }
    }
  })
  .post('/spots', (req, res) => {
    console.log(req.body)
    store.registerSpot(req.body)
    res.send('OK')
  })
  .post('/dbreset', (req, res) => {
    store.dbreset()
    res.send('OK')
  })
  .post('/mode/:mode', (req, res) => {
    console.log(`/mode/${req.params.mode}`)
    store.setUpVisionMode(req.params.mode)
    res.send('OK')
  })
  .get('/image', (req, res) => {
    // const path = 'https://storage.googleapis.com/spotty-205321.appspot.com/pic_a463e446-d20c-418f-93f6-97d44efeb347.jpg'
    // const path = 'mock_pictures/lp-LAW-394.jpg'
    const path = 'mock_pictures/car.jpg'
    imageprocess.api.licenseDetect(path).then(l => console.log(l))
    res.send('OK')
  })
  .get('/taken/:bool', (req, res) => {
    if (req.params.bool === '0') {
      store.spotTaken = false
    }
    if (req.params.bool === '1') {
      store.spotTaken = true
    }
    res.send(store.spotTaken)
  })
  .post('/users', (req, res) => {
    console.log(req.body)
    if (!req.body || !req.body.email || !req.body.password) {
      res.status(400).send("Requires 'email' and 'password' in request body.")
      return
    }
    if (req.body.password.length < 6) {
      res.status(400).send("Requires 'password' to be at least 6 characters.")
      return
    }

    store.registerUser(req.body.email, req.body.password).then(userRecord => {
      res.send(userRecord)
    }).catch(error => {
      res.send(error)
    })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))