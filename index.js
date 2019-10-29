// Reads the current dir through the cd command,
// I don't know if cd on *nix or mac returns the current dir,
// so might not work there. Only tested on Windows.

const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const readline = require('readline')

const obj = {
   todo: [],
   note: []
}

const analyzeFile = file => {

   let isActive = null;
   let kind = null
   let fullMsg = ''
   let lineNum = 0
   let startLineNum = 0
   let endLineNum = 0

   const readInterface = readline.createInterface({
      input: fs.createReadStream(file),
   });

   readInterface.on('line', data => {
      lineNum++
      if (data.trim().startsWith('//')) {
         let match = data.match(/\@(\w+)/)
         if (match) {
            startLineNum = lineNum
            kind = match[1]
            if (kind == 'todo' || kind == 'note') {
               isActive = true
            }
         } else if (isActive) {
            // Trim is called twice here so the white-space before // is removed,
            // and after splitting so the whitespace between // and the comment is removed.
            let text = data.trim().split('//')[1].trim()
            fullMsg += `${text} `
         }
      } else {
         if (kind && isActive) {
            endLineNum = lineNum
            obj[kind].push({ msg: fullMsg, startLineNum, endLineNum, file })
         }

         fullMsg = ''
         isActive = false
         kind = null
      }
   })

   readInterface.on('close', () => {
      // if the last thing in the file was a note or todo
      // without any newlines, this catches it.
      if (fullMsg && kind) {
         endLineNum = lineNum
         obj[kind].push({ msg: fullMsg, startLineNum, endLineNum, file })
      }
      lineNum = 0
   })

}

const goThroughProject = startingPoint => {
   // recursively goes through dirs in current project
   // except node_modules and calls analyzeFile on its files.
   fs.readdir(startingPoint, (err, files) => {
      files.forEach(file => {
         let fullPath = path.join(startingPoint, file)
         if (fs.lstatSync(fullPath).isDirectory()) {
            if (file === 'node_modules' || file == '.git') return
            return goThroughProject(fullPath)
         } else {
            // Only for js file.
            if (file.split('.')[1] === 'js') {
               return analyzeFile(fullPath)
            }
         }
      })
   })
}

cp.exec('cd', (err, res) => {
   // cd returns the current directory you are in
   goThroughProject(res.trim())
})

process.on('beforeExit', () => {
   // Here you can decide what to do with the data.

   // -- Write to a file --
   // fs.writeFileSync('notesAndTodos.json', JSON.stringify(obj, null, 2))

   // -- Log it --
   console.log(obj)
})