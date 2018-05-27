const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()
const LICENSE_PLATE_RE = /^[a-zA-Z0-9]{2,5}[\s-][a-zA-Z0-9]{2,5}$/

const imageprocess = {
  licenseDetect: imagePath => {
    return new Promise((resolve, reject) => {
      client
        .textDetection(imagePath)
        .then(results => {
          const detections = results[0].textAnnotations
          console.log('Text:')
          detections.forEach(detection => console.log(detection.description))
          const licensePlate = detections.filter(d => d['description'].match(LICENSE_PLATE_RE))
          resolve(licensePlate)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  hasCar: imagePath => {
    return new Promise((resolve, reject) => {
      client
        .labelDetection(imagePath)
        .then(results => {
          const labels = results[0].labelAnnotations
          console.log('Labels:')
          labels.forEach(label => console.log(label.description))
          resolve(labels.filter(l => l['description'].includes('car')).length > 0)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = imageprocess