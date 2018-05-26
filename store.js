const imageprocess = require('./imageprocess')
const firebase = require('firebase-admin')
const serviceAccount = require('./spotty-ruhacks-firebase-adminsdk.json')
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://spotty-ruhacks.firebaseio.com'
})
const db = firebase.database()

const Images = [{
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
    latitude: 43.7860579,
    longitude: -79.349437,
    title: "Best Place",
    description: "This is 10/10 driveway",
    price: 0,
    image: Images[0],
  },
  {
    id: 1,
    latitude: 43.6950552,
    longitude: -79.4183759,
    title: "Second Best Place",
    description: "This is 8/10 driveway",
    price: 0,
    image: Images[1],
  },
  {
    id: 2,
    latitude: 43.6944823,
    longitude: -79.4599204,
    title: "Meh",
    description: "It sorta counts",
    price: 0,
    image: Images[2],
  },
  {
    id: 3,
    latitude: 43.6922662,
    longitude: -79.4867893,
    title: "yikes",
    description: "it broke",
    price: 0,
    image: Images[3],
  },
  {
    id: 4,
    latitude: 43.6487793,
    longitude: -79.4007719,
    title: "doggo",
    description: "This is 10/10 dog, 0/10 for parking",
    price: 0,
    image: Images[4],
  }
]

const store = {
  spots: {},
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

db.ref('/images').on('child_added', (snapshot) => {
  const id = snapshot.key()
  const imagePath = snapshot.val()
  console.log(`Updated (${id}) imagePath: ${imagePath}`)
  imageprocess.licenseDetect(imagePath).then(detections => {
    if (!detections) {
      return
    }

    console.log(detections)
  }).catch(err => {
    console.err('Failed detecting license:', err)
  })
}, (err) => {
  console.error('Snapshot failed on /images:', err.code)
})

db.ref('/spots').on('value', (snapshot) => {
  store.spots = snapshot.val()
  console.log('Updated store:', store.spots)
}, (err) => {
  console.error('Snapshot failed on /spots:', err.code)
})

module.exports = store