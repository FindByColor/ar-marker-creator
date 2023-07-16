const fs = require('fs')
const path = require('path')

const { loadReference } = require('./lib/utils.js')
const MarkerCreator = require('./lib/MarkerCreator_wasm.js')

// Setup file info
const fileName = 'fbc-card'
const srcImage = path.join(__dirname, 'fbc-card.jpg')
const outputPath = path.join(__dirname, 'marker')

// Placeholder for image data
let buffer

// Placeholder data for marker image
let imageData = {
  sizeX: 0,
  sizeY: 0,
  nc: 0,
  dpi: 0,
  array: [],
}

// Initialize Marker Creator
MarkerCreator.onRuntimeInitialized = async () => {
  // Make sure fbc-card.jpg exists
  if (!fs.existsSync(srcImage)) {
    console.log(`ERROR: Missing ${srcImage}`)
    process.exit(1)
  } else {
    buffer = fs.readFileSync(srcImage)
  }

  // Create output folder if missing
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  }

  // Load image data from card
  imageData = await loadReference(buffer, imageData, srcImage)

  // Setup memory allocation for data
  const heapSpace = MarkerCreator._malloc(
    imageData.array.length * imageData.array.BYTES_PER_ELEMENT
  )

  // Set initial heap data
  MarkerCreator.HEAPU8.set(imageData.array, heapSpace)

  // Create markers in memory
  MarkerCreator._createImageSet(
    heapSpace,
    imageData.dpi,
    imageData.sizeX,
    imageData.sizeY,
    imageData.nc
  )

  // Free up allocated memory
  MarkerCreator._free(heapSpace)

  // Fetch data from temp files stored in memory
  const content = MarkerCreator.FS.readFile('tempFilename.iset')
  const contentFset = MarkerCreator.FS.readFile('tempFilename.fset')
  const contentFset3 = MarkerCreator.FS.readFile('tempFilename.fset3')

  // Write AR Markers to disk
  fs.writeFileSync(`${outputPath}/${fileName}.iset`, content)
  fs.writeFileSync(`${outputPath}/${fileName}.fset`, contentFset)
  fs.writeFileSync(`${outputPath}/${fileName}.fset3`, contentFset3)

  // Exit node process cleanly
  process.exit(0)
}
