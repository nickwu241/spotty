const imageprocess = require('./imageprocess')
const firebase = require('firebase-admin')
const serviceAccount = require('./spotty-ruhacks-firebase-adminsdk.json')
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://spotty-ruhacks.firebaseio.com'
})
const db = firebase.database()

const Images = [{
    uri: "https://i.imgur.com/HPLqOMP.jpg"
  },
  {
    uri: "https://i.imgur.com/HbzylNq.jpg"
  },
  {
    uri: "https://i.imgur.com/W4ETKKQ.jpg"
  },
  {
    uri: "https://i.imgur.com/YjPo3PR.jpg"
  },
  {
    uri: "https://i.imgur.com/nzUxP26.jpg"
  },
  {
    uri: "https://i.imgur.com/lHVuZ7g.jpg"
  },
  {
    uri: "https://i.imgur.com/L01KF.jpg"
  }
]

const mockSpots = [{
    id: 0,
    latitude: 43.6531438,
    longitude: -79.3809275,
    title: "Ming Sing Tao-Tak Temple",
    description: "Best temple in town",
    price: 0,
    image: Images[0],
    carParked: false,
    licenseVerified: false
  },
  {
    id: 1,
    latitude: 43.6595874,
    longitude: -79.3779367,
    title: "Lively Spot in Downtown",
    description: "Lots of food! Right beside Kinka Izakaya",
    price: 0,
    image: Images[1],
    carParked: false,
    licenseVerified: false
  },
  {
    id: 2,
    latitude: 43.7860579,
    longitude: -79.349437,
    title: "Best Place",
    description: "This is 10/10 driveway",
    price: 0,
    image: Images[2],
    carParked: false,
    licenseVerified: false
  },
  {
    id: 3,
    latitude: 43.6950552,
    longitude: -79.4183759,
    title: "Second Best Place",
    description: "This is 8/10 driveway",
    price: 0,
    image: Images[3],
    carParked: false,
    licenseVerified: false
  },
  {
    id: 4,
    latitude: 43.6944823,
    longitude: -79.4599204,
    title: "Meh",
    description: "It sorta counts",
    price: 0,
    image: Images[4],
    carParked: false,
    licenseVerified: false
  },
  {
    id: 5,
    latitude: 43.6922662,
    longitude: -79.4867893,
    title: "yikes",
    description: "it broke",
    price: 0,
    image: Images[5],
    carParked: false,
    licenseVerified: false
  },
  {
    id: 6,
    latitude: 43.6487793,
    longitude: -79.4007719,
    title: "doggo",
    description: "This is 10/10 dog, 0/10 for parking",
    price: 0,
    image: Images[6],
    carParked: false,
    licenseVerified: false
  }
]

const store = {
  device: [],
  spots: [],
  visionMode: imageprocess.api,
  setUpListeners: function () {
    console.log('Setting up db listeners...')
    db.ref('/image').on('child_added', snapshot => {
      const id = snapshot.key
      const imagePath = snapshot.val()
      console.log(`Updated (${id}) imagePath: ${imagePath}`)

      store.visionMode.licenseDetect(imagePath).then(plates => {
        console.log('plates:', plates)
        if (plates.length == 0) {
          return
        }
        console.log('plate:', plates[0])
      }).catch(err => {
        console.error('Failed detecting license:', err)
      })
      // store.visionMode.hasCar(imagePath).then(hasCar => {
      //   console.log('Has car:', hasCar)
      // }).catch(err => {
      //   console.error('Failed detecting car:', err)
      // })
      db.ref(`/image/${id}`).remove()
    }, (err) => {
      console.error('Snapshot failed on /images:', err.code)
    })

    db.ref('/spots').on('value', snapshot => {
      store.spots = snapshot.val()
      console.log('Updated store:', store.spots)
    }, (err) => {
      console.error('Snapshot failed on /spots:', err.code)
    })

    db.ref('/camera').on('value', snapshot => {
      console.log('Updated camera:', snapshot.val())
    })

    db.ref('/device').on('value', snapshot => {
      store.device = snapshot.val()
      if (store.spots[0] && store.device[1]) {
        store.spots[0]['device'] = store.device[0]
      }
      if (store.spots[1] && store.device[1]) {
        store.spots[1]['device'] = store.device[1]
      }
    })
  },
  setUpVisionMode: function (mode) {
    // mode: 'api' or 'local'.
    if (mode === 'api') {
      this.visionMode = imageprocess.api
    }
    if (mode === 'local') {
      this.visionMode = imageprocess.local
    }
  },
  registerSpot: function (spot) {
    console.log(this.spots)
    db.ref('/spots').child(`${this.spots.length}`).set(spot)
  },
  registerUser: function (email, password) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUser({
        email: email,
        password: password,
      }).then(userRecord => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord)
        resolve(userRecord)
      }).catch(err => {
        console.log("Error creating new user:", err)
        reject(err)
      })
    })
  },
  dbreset: function () {
    db.ref('spots').set(mockSpots)
  }
}


module.exports = store