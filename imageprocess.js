const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()
const API_KEY = 'AIzaSyBd9VvTLPUCnq9gQYu-S2dLSpZ6vX-qWj4'

const imageprocess = {
  licenseDetect: (imagePath) => {
    return new Promise((resolve, reject) => {
      client
        .textDetection(imagePath)
        .then(results => {
          const detections = results[0].textAnnotations
          resolve(detections)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = imageprocess