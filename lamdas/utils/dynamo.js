/* 
    This files defines re-usable methods
    used to interact with tables of Dynamo DB

*/

const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const Dynamo = {
    async get(shorturl, TableName) {
        const params = {
            TableName,
            Key: {
                shorturl
            }
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was error in geting data, ${JSON.stringify(params)}`);
        }

        console.log(data);
        return data.Item;
    },
    async write(data, TableName) {
        if (!data) {
            throw Error('No data provided while creating user');
        }

        const params = {
            TableName,
            Item: data
        }

        let result = await documentClient.put(params).promise();
        return result;
    }, 
    async updateStats(data, TableName) {
        if (!data) {
            throw Error('No data provided while updaing stats');
        }
        let ID = uuidv4(); // using uuid to create unique id (primary  key)
        data.ID = ID;

        const params = {
            TableName,
            Item: data
        }

        let result = await documentClient.put(params).promise();
        return result;
    },

    async query ({index, TableName, key, val}) {
        const params = {
            IndexName: index,
            TableName,
            KeyConditionExpression: `${key} = :hkey`,
            ExpressionAttributeValues: {
                ':hkey': val
            }
        }

        const response = await documentClient.query(params).promise();

        return response.Items || [];
    }
}

module.exports = Dynamo;