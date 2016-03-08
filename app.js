var eddystoneBeacon = require('eddystone-beacon'),
  Lcd = require('lcd'),
  https = require('https'),
  Gpio = require('onoff').Gpio,
  url = 'https://vqms.herokuapp.com';
    
var httpOptions = {
  hostname: 'vqms.herokuapp.com',
  port: 443,
  path: '/',
  method: ''
};
var beaconOptions =  {name: 'Beacon',  txPowerLevel: -22,  tlmCount:2,  tlmPeriod: 10};
eddystoneBeacon.advertiseUrl(url, beaconOptions);

console.log('transmitting url: '+url);
console.log('Beacon Configuration: '+options);

var lcd = new Lcd({rs: 14, e: 15, data: [18, 17, 23, 24], cols: 8, rows: 1});
lcd.on('ready', function () {
  setInterval(showTokenNumber, 5000);
});
console.log('Printing to LCD');

var pir = new Gpio(27, 'in', 'both');
pir.watch(function(err, value) {
  if (err) exit();
  console.log('Exit detected:: value '+value);
  if(value == 1) {
    countExit();  
  }
});
console.log('Scanning the exit gate.');

var showTokenNumber = function(){
  lcd.setCursor(0, 0);
  httpOptions.path = 'token';
  httpOptions.path = 'GET';
  var req = https.request(httpOptions, (res) => {
    //console.log('statusCode: ', res.statusCode);
    //console.log('headers: ', res.headers);
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

var countExit = function(){
  httpOptions.path = 'exit';
  httpOptions.path = 'POST';
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

function exit() {
  pir.unexport();
  process.exit();
}

process.on('SIGINT', function () {
  pir.unexport();
  lcd.close();
  process.exit();
});

