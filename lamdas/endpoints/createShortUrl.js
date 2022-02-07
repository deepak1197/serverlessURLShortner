/* 
    Creating short Url using long url provided in request body 
*/

const Responses = require('../utils/api_responses');
const Dynamo = require('../utils/dynamo');

const TableName = process.env.TableName;

exports.handler = async (event) => {

    const longURL = JSON.parse(event.body).longURL;
    const MIN_SHORT_URL_LENGTH = 10;

    if (!longURL || longURL.length < MIN_SHORT_URL_LENGTH) {
        return Responses._400({message: 'Invalid long url'});
    }

    let shorturl = Math.random().toString(36).substring(2);
    let data = {longURL, shorturl};

    let response = await Dynamo.write(data, TableName).catch((err) => {
        console.log(`Error in dynamo write`, err);
        return err;
    });

    if (!response) {
        return Responses._400({message: `Failed to create short url for ${longurl}`});
    } else {
        return Responses._200({message: `Created Url long:${longURL} short: https://uShorturl/${shorturl}`});
    }
};



