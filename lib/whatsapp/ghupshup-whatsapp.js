var request = require('request');
var debug = require('debug');

//set gupshup keys
const {gupshup_VelarHealthApi_source_number,gupshup_VelarHealthApi_api_key,gupshup_VelarHealthApi_appName}=require ('../../Config/keys');
let source =  gupshup_VelarHealthApi_source_number;
const apiKey=gupshup_VelarHealthApi_api_key ;
//set name
let appNameRemote=gupshup_VelarHealthApi_appName
const logName='gs-wa::'
const makeWhatsAppMessage = (number = '', message = '') => {
    debug(`${logName}makeSms${number.toString()}${message.toString()}`);
    if (number && number.length > 0 && message && message.length > 0) {

        var dataString = `channel=whatsapp&source=${source}&destination=91${number}&message=${encodeURI(message)}&src.name=${appNameRemote}`;
        return makeApiCall(dataString)
    } else {
        throw new Error('number or message missing')
    }
};
// 919131388606
const makeApiCall = (dataStr) => {
    return new Promise((resolve, reject) => {

        debug('whatsApp-Ghupshup-makeApiCall',dataStr);
        var headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': apiKey,
            'cache-control': 'no-cache'
        };

        var options = {
            url: 'https://api.gupshup.io/sm/api/v1/msg',
            method: 'POST',
            headers: headers,
            body: dataStr
        };

        function callback(error, response, body) {
            debug('whatsApp-Ghupshup-response',error,response,body);
            if (!error && response.statusCode == 200) {
                console.log(body);
                // cb(error, response, body)
                resolve(body)
            }else {
                reject(error,response)
            }
        }

        request(options, callback);

    })
}

module.exports= {makeWhatsAppMessage}
// var headers = {
//     'Cache-Control': 'no-cache',
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'apikey': '76b37dbeebd341cbc187574a1d4f9145',
//     'cache-control': 'no-cache'
// };
//
// var dataString = `channel=whatsapp&source=${source}&destination=91${customer}&message=${url_encoded_msg}&src.name=VelarHealthApi`;
// // var dataString = 'channel=whatsapp&source=917834811114&destination=91&message=&src.name=VelarHealthApi';
//
// var options = {
//     url: 'https://api.gupshup.io/sm/api/v1/msg',
//     method: 'POST',
//     headers: headers,
//     body: dataString
// };
//
// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     }
// }
//
// request(options, callback);
