const bodyParser = require('body-parser')
const express = require('express')
const geolib = require('geolib')
const path = require('path')
const imageprocess = require('./imageprocess')
const store = require('./store')
const PORT = process.env.PORT || 5000

const DEFAULT_RADIUS = 5000

express()
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
    console.log('/spots', area, radius)

    if (!req.query.lat || !req.query.lon) {
      res.send(store.spots)
    } else {
      const spots = store.spots.filter(spot => geolib.getDistance(spot, area) < radius)
      res.send(spots)
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
  .get('/image/:path', (req, res) => {
    const imagePath = req.params.path
    console.log(imagePath)
    imageprocess.licenseDetect(imagePath).then(detections => {
      if (!detections) {
        return
      }

      console.log(detections)
    }).catch(err => {
      console.error('Failed detecting license:', err)
    })
    imageprocess.hasCar(imagePath)
    res.send('OK')
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