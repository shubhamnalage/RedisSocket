const express = require("express");
const axios = require("axios");
const redis = require("ioredis");

const app = express();
const port = process.env.PORT || 3000;
const DEFAULT_EXPIRATION = 3600;

const redisClient = redis.createClient({
  host: "redis-13312.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  port: 13312,
  password: "y9tVWuJvIo5399ZBVhvtv8Y9nSAdhDAW",
});

redisClient.on("connect", () => {
  console.log("connected to redis successfully!");
});

redisClient.on("error", (error) => {
  console.log("Redis connection error :", error);
});

async function fetchApiData() {
  const apiResponse = await axios.get(
    `https://newsport.fancybet.io/api/get-game-cricketdata`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function cacheData(req, res, next) {
  const redisData = req.params.redisData;
  try {
    const cacheResults = await redisClient.get(redisData);
    if (cacheResults) {
      res.send({
        fromCache: true,
        data: JSON.parse(cacheResults),
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

async function getOddsData(req, res) {
  const redisData = req.params.redisData;
  let results;

  try {
    results = await fetchApiData();
    if (results.length === 0) {
      throw "API returned an empty array";
    }
    await redisClient.set(
      redisData,
      JSON.stringify(results),
      "EX",
      DEFAULT_EXPIRATION
    );

    res.send({
      fromCache: true,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}


app.get("/get_odds", cacheData, getOddsData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
