const im = require('imagemagick')
const inkjet = require('inkjet')
const readlineSync = require('readline-sync')

/**
 * Detect Color Space
 */
const detectColorSpace = (arr) => {
  const target = parseInt(arr.length / 4)

  let counter = 0

  for (let j = 0; j < arr.length; j += 4) {
    const r = arr[j]
    const g = arr[j + 1]
    const b = arr[j + 2]

    if (r === g && r === b) {
      counter++
    }
  }

  if (target === counter) {
    return 1
  } else {
    return 3
  }
}

/**
 * Extract EXIF Data
 *
 * @param {Object} buf Buffer data
 * @param {Object} imageData Image data
 * @param {String} srcImage Absolute path to source image
 * @returns Promise
 */
const extractExif = (buf, imageData, srcImage) => {
  let answer = null
  return new Promise((resolve) => {
    inkjet.exif(buf, async (err, metadata) => {
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        if (
          metadata == null ||
          Object.keys(metadata).length === undefined ||
          Object.keys(metadata).length <= 0
        ) {
          const ret = await imageMagickIdentify(srcImage)

          if (ret.err) {
            answer = readlineSync.question(
              'The EXIF info of this image is empty or it does not exist. Do you want to inform its properties manually?[y/n]\n'
            )

            if (answer == 'y') {
              const answerWH = readlineSync.question(
                'Inform the width and height: e.g W=200 H=400\n'
              )

              const valWH = getValues(answerWH, 'wh')
              imageData.sizeX = valWH.w
              imageData.sizeY = valWH.h

              const answerDPI = readlineSync.question(
                'Inform the DPI: e.g DPI=220 [Default = 72](Press enter to use default)\n'
              )

              if (answerDPI == '') {
                imageData.dpi = 72
              } else {
                const val = getValues(answerDPI, 'dpi')
                imageData.dpi = val
              }
            } else {
              console.log('Exiting process!')
              process.exit(1)
            }
          } else {
            imageData.sizeX = ret.features.width
            imageData.sizeY = ret.features.height
            const resolution = ret.features.resolution
            let dpi = null
            if (resolution) {
              const resolutions = resolution.split('x')
              if (resolutions.length === 2) {
                dpi = Math.min(
                  parseInt(resolutions[0]),
                  parseInt(resolutions[1])
                )
                if (dpi == null || isNaN(dpi)) {
                  dpi = 72
                }
              }
            } else {
              dpi = 72
            }

            imageData.dpi = dpi
          }
        } else {
          let dpi = 72

          if (parseInt(metadata['XResolution'] != null)) {
            dpi = Math.min(
              parseInt(metadata['XResolution'].description),
              parseInt(metadata['YResolution'].description)
            )
          }

          if (
            metadata['Image Width'] == null ||
            metadata['Image Width'] === undefined
          ) {
            if (
              metadata['PixelXDimension'].value == null ||
              metadata['PixelXDimension'].value === undefined
            ) {
              answer = readlineSync.question(
                'The image does not contain any width or height info, do you want to inform them?[y/n]\n'
              )
              if (answer === 'y') {
                const answer2 = readlineSync.question(
                  'Inform the width and height: e.g W=200 H=400\n'
                )

                const values = getValues(answer2, 'wh')
                imageData.sizeX = values.w
                imageData.sizeY = values.h
              } else {
                console.log(
                  "It's not possible to proceed without width or height info!"
                )
                process.exit(1)
              }
            } else {
              imageData.sizeX = metadata['PixelXDimension'].value
              imageData.sizeY = metadata['PixelYDimension'].value
            }
          } else {
            imageData.sizeX = metadata['Image Width'].value
            imageData.sizeY = metadata['Image Height'].value
          }

          imageData.nc = metadata['Color Components'].value
          imageData.dpi = dpi
        }
      }

      resolve(imageData)
    })
  })
}

/**
 * Get EXIF values
 *
 * @param {String} str Parameter
 * @param {String} type Value type
 * @returns Object
 */
const getValues = (str, type) => {
  let values
  if (type == 'wh') {
    const w = 'W='
    const h = 'H='
    const doesContainW = str.indexOf(w)
    const doesContainH = str.indexOf(h)

    const valW = parseInt(str.slice(doesContainW + 2, doesContainH))
    const valH = parseInt(str.slice(doesContainH + 2))

    values = {
      w: valW,
      h: valH,
    }
  } else if (type == 'nc') {
    const nc = 'NC='
    const doesContainNC = str.indexOf(nc)
    values = parseInt(str.slice(doesContainNC + 3))
  } else if (type == 'dpi') {
    const dpi = 'DPI='
    const doesContainDPI = str.indexOf(dpi)
    values = parseInt(str.slice(doesContainDPI + 4))
  }

  return values
}

/**
 * Identify source image with ImageMagick
 *
 * @param {String} srcImage Absolute path of source image
 * @returns Promise
 */
const imageMagickIdentify = (srcImage) => new Promise((resolve) => {
  im.identify(srcImage, (err, features) => {
    resolve({ err: err, features: features })
  })
})

/**
 * Load Reference image fbc-card.jpg
 *
 * @param {Object} buf Memory buffer
 * @param {Object} imageData Image data from source
 * @param {String} srcImage Absolute path to image source
 * @returns Object Processed image data
 */
const loadReference = async (buf, imageData, srcImage) => {
  inkjet.decode(buf, (err, decoded) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      const newArr = []

      const verifyColorSpace = detectColorSpace(decoded.data)

      if (verifyColorSpace === 1) {
        for (let j = 0; j < decoded.data.length; j += 4) {
          newArr.push(decoded.data[j])
        }
      } else if (verifyColorSpace === 3) {
        for (let j = 0; j < decoded.data.length; j += 4) {
          newArr.push(decoded.data[j])
          newArr.push(decoded.data[j + 1])
          newArr.push(decoded.data[j + 2])
        }
      }

      const uint = new Uint8Array(newArr)
      imageData.nc = verifyColorSpace
      imageData.array = uint
    }
  })

  return await extractExif(buf, imageData, srcImage)
}

exports.loadReference = loadReference
