var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});



router.get('/eventstream', (req, res, next) => {
  // Sends out messages as they're emitted.  Is subscribed to.
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  myEmitter.on('message', data => {
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // res.status(200).json(data) ;
  });

});

router.get('/test_time', function (req, res, next) {
  // Emits a message
  myEmitter.emit('message', {
    title: 'New message!',
    timestamp: new Date()
  });
  
  res.render('testing/luxon/basicLuxon');
});

// router.get('/test_sse', function (req, res, next) {

//   myEmitter.emit('message', {
//       title: 'New message!',
//       message,
//       timestamp: new Date()
//     });

//   // res.render('testing/test_sse');
// });

module.exports = router;