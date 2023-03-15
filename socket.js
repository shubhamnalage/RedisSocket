const redis = require('redis');
const redisClient = redis.createClient();

io.on('connection', (socket) => {
  console.log('A client has connected');

  // Listen for JSON data from the client
  socket.on('json_data', (jsonData) => {
    console.log(`Received JSON data: ${jsonData}`);

    // Parse the JSON data
    const parsedJsonData = JSON.parse(jsonData);

    // Store the JSON data in Redis
    const key = 'unique_identifier'; // Replace with a unique identifier
    redisClient.set(key, JSON.stringify(parsedJsonData));

    // Send a response back to the client
    socket.emit('json_data_received', parsedJsonData);
  });

  // Retrieve JSON data from Redis
  socket.on('get_json_data', () => {
    const key = 'unique_identifier'; // Replace with the same unique identifier used when storing the data
    redisClient.get(key, (error, jsonData) => {
      if (error) {
        console.error(error);
      } else {
        // Parse the JSON data
        const parsedJsonData = JSON.parse(jsonData);
        
        // Send the JSON data back to the client
        socket.emit('json_data', parsedJsonData);
      }
    });
  });
});
