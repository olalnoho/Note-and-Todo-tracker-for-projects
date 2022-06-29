# Note-and-Todo-tracker-for-projects
Goes trough all dirs and files in current project, collects comments that start with @note or @todo and puts their contents into an object.

e.g.
<pre>
function test(){
  // @note
  // this is a note about the test function
  // it can be multiple lines as well
  // woho!
  const a = 1
}

function add(x, y) {
  // @todo maybe add support for callback?
  // return cb(x,y) ???
  return x + y
}

// @note
// End of file
</pre>

would look like
<pre>
{
  todos: [
    {
      msg: 'maybe add support for callback? return cb(x,y) ???',
      startLineNum: 10,
      endLineNum: 12,
      file: 'path to the file would go here'
    }
  ],
  notes: [
    {
      msg: 'this is a note about the test function it can be multiple lines as well woho!',
      startLineNum: 2,
      endLineNum: 6,
      file: 'path to the file would go here'
    }, 
    {
      msg: 'End of file',
      startLineNum: 15,
      endLineNum: 17,
      file: 'path to the file would go here'
    }
  ]
}
</pre>
