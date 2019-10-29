#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const readline = require('readline')

const obj = {
   todos: [],
   notes: []
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
      data = data.trim()
      if (data.startsWith('//')) {
         let tokens = data.split(/\@(\w+)/)
         if (['todo', 'note'].includes(tokens[1])) {
            startLineNum = lineNum

            // Just because i want to pluralize the object arrays.
            kind = tokens[1] + 's'
            isActive = true

            // If there are any other text after the todo/note, include it.
            let remains = tokens.slice(2).join('').trimLeft()
            if (remains) {
               fullMsg += remains
            }

         } else if (isActive) {
            let text = data.split(/^\/\//)[1]
            if (fullMsg == '') {
               // For formatting purposes.
               text = text.trim()
            }
            fullMsg += `${text}`
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
   fs.readdir(startingPoint, (err, files) => {
      files.forEach(file => {
         let fullPath = path.join(startingPoint, file)
         if (fs.lstatSync(fullPath).isDirectory()) {
            if (file === 'node_modules' || file == '.git') return
            return goThroughProject(fullPath)
         } else {
            if (file.split('.')[1] === 'js') {
               return analyzeFile(fullPath)
            }
         }
      })
   })
}

cp.exec('cd', (err, res) => {
   // cd on Windows returns current directory
   // I don't know if this works on Linux or Mac
   goThroughProject(res.trim())
})

process.on('beforeExit', () => {
   if (process.argv[2] === '-f') {
      fs.writeFileSync('notesAndTodos.json', JSON.stringify(obj, null, 2))
   }
   console.log(obj)
})