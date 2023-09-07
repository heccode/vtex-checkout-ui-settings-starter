const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const { exec } = require("child_process")

const moveFiles = (sourceDir, destDir) => {
  return fs.readdirAsync(sourceDir).map(function(file) {
    const destFile = path.join(destDir, file)

    if (file === '.gitignore') {
      return
    }

    return fs.renameAsync(path.join(sourceDir, file), destFile).then(function() {
      return destFile
    })
  })
}

moveFiles(path.join(__dirname, '../checkout-ui-settings'), path.join(__dirname, '..')).then(function(files) {
  exec('rm -rf checkout-ui-settings')
}).catch(function(err) {
  console.log('An error ocurred while try move file from checkout-ui-settings folder')
})
