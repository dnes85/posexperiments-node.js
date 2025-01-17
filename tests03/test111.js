var stream = require('stream');
var util = require('util');
// use Node.js Writable, otherwise load polyfill
var Writable = stream.Writable ||
  require('readable-stream').Writable;

var memStore = { };

var timezero = process.hrtime();


/* Writable memory stream */
function WMStrm(key, options) {
  // allow use without new operator
  if (!(this instanceof WMStrm)) {
    return new WMStrm(key, options);
  }
  Writable.call(this, options); // init super
  this.key = key; // save key
  memStore[key] = new Buffer(''); // empty
}
util.inherits(WMStrm, Writable);

WMStrm.prototype._write = function (chunk, enc, cb) {
  // our memory store stores things in buffers
  var buffer = (Buffer.isBuffer(chunk)) ?
    chunk :  // already is Buffer use it
    new Buffer(chunk, enc);  // string, convert

  // concat to the buffer already there
  memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
  cb();
};


// Trying our stream out
var wstream = new WMStrm('foo');
wstream.on('finish', function () {
  
  console.log('value is:', memStore.foo.toString());
console.log('finished writing');

var diff = process.hrtime(timezero); 
console.log("Execution time       : %ds %dms", diff[0], diff[1]/1000000); //


});

  
for (i=1;i<300000;i+=1){
  wstream.write('t:'+i);
}

//for 300000 -> Execution time: 142s 733.016696ms



wstream.end();
