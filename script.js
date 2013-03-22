var request = require('request');

var ssid = process.env.TWILIO_SSID;
var token = process.env.TWILIO_TOKEN;
var productId = 108000;
var styleId = 15648;
var stockId = 10261768;
var url = 'http://api.zappos.com/Product?id='+productId+'&includes=["sizing","styles","stocks"]&excludes=["size"]&key=8d97e07514c4930831436e9a7c787be4ac68211c'

request(url, function (error, response, body) {
  var product = JSON.parse(body).product[0];
  product.styles.forEach( function (style) {
    style.stocks.forEach( function (stock) {
      if (stock.stockId == stockId && stock.onHand < 100) {
        console.log('ding ding!', stock.stockId, stock.onHand)
        var tUrl = 'https://api.twilio.com/2010-04-01/Accounts/AC2cff67a642fc015fef390f34f737ce72/SMS/Messages.json';
        request.post(tUrl, {
            form: {
              From: process.env.PHONE_FROM,
              To: process.env.PHONE_TO,
              Body: 'TIME TO BUY YOUR DRESS! ONLY 1 LEFT!'
            },
            auth: {
              'user': ssid,
              'pass': token,
              'sendImmediately': true
            }
          },
          function (err, res, body) {
          console.log(err, body)
          
        });
      }
    })
  });
});
