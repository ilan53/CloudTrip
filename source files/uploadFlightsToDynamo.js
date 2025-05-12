const fs = require('fs');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = 'DynamoFlights-Flights-XW9V1JY3U3QK';
const REGION = 'us-east-1'; // שנה לפי האזור שלך אם צריך

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// קריאה לקובץ JSON
const jsonFlights = require('./flights.json');  // אם הקובץ הוא 'flights.json'

async function uploadFlights() {
  for (const flight of jsonFlights) {
    const item = {
      id: `${flight.operatorShort}-${flight.number}-${flight.schedueTime}`, // יצירת id ייחודי לכל טיסה
      operatorShort: flight.operatorShort,
      operatorLong: flight.operatorLong,
      schedueTime: flight.schedueTime,
      actualTime: flight.actualTime,
      type: flight.type,
      cityCode: flight.cityCode,
      airport: flight.airport,
      city: flight.city,
      country: flight.country,
      terminal: flight.terminal,
      counter: flight.counter,
      zone: flight.zone,
      status: flight.status,
    };

    try {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      }));
      console.log(`✅ נוספה טיסה: ${item.id}`);
    } catch (err) {
      console.error(`❌ שגיאה בהוספת טיסה ${item.id}:`, err.message);
    }
  }

  console.log('🎉 סיום טעינת כל הנתונים');
}

uploadFlights();
