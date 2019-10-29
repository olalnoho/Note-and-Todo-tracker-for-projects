# Note-and-Todo-tracker-for-projects
Goes trough all dirs and files in current project, collects comments that start with @note or @todo and puts their contents into an object.

e.g.
-- START OF FILE --
<pre>
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
</pre>
-- END OF FILE

would look like
<pre>
{
  todo: [
    {
      msg: 'maybe add support for callback?',
      startLineNum: 8,
      endLineNum: 10,
      file: 'path to the file would go here'
    }
  ],
  note: [
    {
      msg: 'this is a note about the test function',
      startLineNum: 2,
      endLineNum: 4,
      file: 'path to the file would go here'
    }, 
    {
      msg: 'End of file',
      startLineNum: 13,
      endLineNum: 15,
      file: 'path to the file would go here'
    }
  ]
}
</pre>
