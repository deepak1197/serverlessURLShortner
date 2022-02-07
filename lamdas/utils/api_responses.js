/* 
    Resuable HTTP responses, that are sent in response to API calls 
*/

const Responses = {
    _200(data = {}) {
        return {
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(data)
        }
    },
    _400(data = {}) {
        return {
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 400,
            body: JSON.stringify(data)
        }
    }
}

module.exports = Responses;