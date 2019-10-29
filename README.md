# Note-and-Todo-tracker-for-projects
Goes trough all dirs and files in current project, collects comments that start with @note or @todo and puts their contents into an object.

e.g.
-- START OF FILE --
function test(){
  // @note
  // this is a note about the test function
  const a = 1
}

function add(x, y) {
  // @todo
  // maybe add support for callback?
  return x + y
}

// @note
// End of file

-- END OF FILE

would look like

{
  todo: [
    {
      msg: 'maybe add support for callback?',
      startLineNum: 13,
      endLineNum: 15,
      file: 'pathToFile'
    }
  ],
  note: [
    {
      msg: 'this is a note about the test function',
      startLineNum: 7,
      endLineNum: 9,
      file: 'pathToFile'
    }, 
    {
      msg: 'End of file',
      startLineNum: 18,
      endLineNum: 20,
      file: 'pathToFile'
    }
  ]
}
