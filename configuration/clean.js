const fs = require('fs')
const path = require('path')
const environment = require('../configuration/environment')

const main = () => {
  console.log('Cleaning checkout-ui-custom folder...')

  const PROTECTED_FILES = ['checkout6-custom.js', 'checkout6-custom.css']

  fs.readdir(environment.paths.output, (err, files) => {
    if (err) {
      console.log('error reading files: ', err)
    }

    if (Array.isArray(files)) {
      files.forEach((file) => {
        const fileDir = path.join(environment.paths.output, file)

        if (!PROTECTED_FILES.includes(file)) {
          fs.unlinkSync(fileDir)
        }
      })
    }
  })

  console.log('Your checkout-ui-custom folder is clean, it\'s ready for link.')
}

main()
