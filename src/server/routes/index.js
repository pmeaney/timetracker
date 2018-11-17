var express = require('express');
var router = express.Router();
const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

router.get('/eventstream', (req, res, next) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  myEmitter.on('message', data => {
    res.write(`event: message\n`);
    res.write(`${JSON.stringify(data)}\n\n`);
    // res.status(200).json(data) ;
  });

});

router.get('/test_time', function (req, res, next) {

  myEmitter.emit('message', {
    title: 'New message!',
    timestamp: new Date()
  });

  res.render('testing/luxon/basicLuxon');


});



  // const sendData = (data) => {
  //   // res.status(200).json(data);
  //   res.write(`event: message\n`);
  //   res.write(`data: ${JSON.stringify(data)}\n\n`);
  //   // res.write(`ok...\n\n`);
  // }

  // myEmitter.on('message', sendData(data))


// router.get('/test_sse', function (req, res, next) {

//   myEmitter.emit('message', {
//       title: 'New message!',
//       message,
//       timestamp: new Date()
//     });

//   // res.render('testing/test_sse');
// });





module.exports = router;