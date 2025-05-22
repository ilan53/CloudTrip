const fs = require('fs');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = 'Flights';
const REGION = 'us-east-1'; // שנה לפי האזור שלך אם צריך

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// קריאה לקובץ JSON
const jsonFlights = require('./flights_data.json');

async function uploadFlights() {
  for (const flight of jsonFlights) {
    const id = `${flight.flightNumber}-${flight.date}-${flight.time}`; // מזהה ייחודי

    const item = {
      id,
      from: flight.from,
      to: flight.to,
      date: flight.date,
      time: flight.time,
      flightNumber: flight.flightNumber,
      operator: flight.operator,
      price: flight.price,
      durationMinutes: flight.durationMinutes,
      stops: flight.stops,
      aircraft: flight.aircraft,
      availableSeats: flight.availableSeats,
      classOptions: flight.classOptions
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
