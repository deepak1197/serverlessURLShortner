/*
    Defines an endpoint to get long url by providing short url in request parameters

    Also updating stats - can be abstracted to seprate file
*/

const Responses = require('../utils/api_responses');
const Dynamo = require('../utils/dynamo');

const DataTableName = process.env.TableName;
const LogsTableName = process.env.FetchLogsTable;

exports.handler = async (event, context) => {

    if (!event.pathParameters || !event.pathParameters.shorturl) {
        return Responses._400({message: 'Missing shorturl in params'})
    } else {
        let shorturl = event.pathParameters.shorturl;
        const MIN_SHORT_URL_LENGTH = 5;

        if (!!shorturl && shorturl.length > MIN_SHORT_URL_LENGTH) { // short url will have a min length

            const url = await Dynamo.get(shorturl, DataTableName).catch((err) => {
                console.log(`Error in dynamo get`, err); // For loggin purposes only
                return {Error:`No url found for ${shorturl}` };
            });

            if (!url) {
                return Responses._400({message: `No url found for ${shorturl} `});
            } else {
                
                let statInfo = {
                    IP: event['headers']['X-Forwarded-For'],
                    shorturl,
                    time: new Date()
                }

                await Dynamo.updateStats(statInfo, LogsTableName);

                return Responses._200({url});
            }
            
        } else {
            return Responses._400({message: "Invalid short url"});
        }
    }
}
