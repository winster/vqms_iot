var eddystoneBeacon = require('eddystone-beacon');

var options = {
  name: 'Beacon',
  txPowerLevel: -22,
  tlmCount:2,
  tlmPeriod: 10
};
var url = 'https://vqms.herokuapp.com';
eddystoneBeacon.advertiseUrl(url, options);
console.log('transmitting url: '+url);
console.log('Power level: '+options.txPowerLevel);
console.log('Time period: '+options.tlmPeriod);


var Lcd = require('lcd'),
  lcd = new Lcd({rs: 14, e: 15, data: [18, 17, 23, 24], cols: 8, rows: 1}),
  https = require('https');

var options = {
  hostname: 'vqms.herokuapp.com',
  port: 443,
  path: '/token',
  method: 'GET'
};

lcd.on('ready', function () {
  setInterval(getTokenNumber, 5000);
});

var getTokenNumber = function(){
  lcd.setCursor(0, 0);
  var req = https.request(options, (res) => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);
    var data = 'token # ';
    res.on('data', (d) => {
      process.stdout.write(d);
      data+=d;
    });
    res.on('end', ()=> {
      lcd.print(data, function (err) {
        if (err) {
          throw err;
        }
      });
    });
  });
  req.end();
  req.on('error', (e) => {
    console.error(e);
  });
};

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function () {
  lcd.close();
  process.exit();
});

var Gpio = require('onoff').Gpio,
  pir = new Gpio(27, 'in', 'both'),
  https = require('https');

var options = {
  hostname: 'vqms.herokuapp.com',
  port: 443,
  path: '/exit',
  method: 'POST'
};

pir.watch(function(err, value) {
  if (err) exit();
  console.log('Exit detected:: value '+value);
  if(value == 1) {
    var req = https.request(options, (res) => {
      //console.log('statusCode: ', res.statusCode);
      //console.log('headers: ', res.headers);
      var data = '';
      res.on('data', (d) => {
        data+=d;
      });
      res.on('end', ()=> {
        console.log(data);
      });
    });
    req.end();
    req.on('error', (e) => {
      console.error(e);
    });
  }
});

console.log('Scanning the exit gate.');

function exit() {
  pir.unexport();
  process.exit();
}


