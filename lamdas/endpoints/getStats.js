/* API to fetch stats of short url usage */
const Responses = require('../utils/api_responses');
const Dynamo = require('../utils/dynamo');

const LogsTableName = process.env.FetchLogsTable;

exports.handler = async (event, context) => {

    if (!event.pathParameters || !event.pathParameters.shorturl) {
        return Responses._400({message: 'Missing shorturl in params'});
    } else {
        let shorturl = event.pathParameters.shorturl;
        const MIN_SHORT_URL_LENGTH = 5;

        if (!!shorturl && shorturl.length > MIN_SHORT_URL_LENGTH) { // short url will have a min length

            const stats = await Dynamo.query({
                index: 'shorturl-index', 
                TableName: LogsTableName,
                key: 'shorturl',
                val: shorturl
                }).catch((err) => {
                console.log(`Error in quering dynamo `, err);

                return {Error:`No stats found for ${shorturl}` };
            });

            if (!stats) {
                return Responses._400({message: `No starts are available for ${shorturl} `});
            } else {
                return Responses._200({stats});
            }
            
        } else {
            return Responses._400({message: "Invalid short url"});
        }
    }
}
