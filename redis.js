// const express = require("express");
// const axios = require("axios");

// const app = express();

// app.use(express.json());

// const port = process.env.PORT || 3000;

// async function fetchApiData() {
//   const apiResponse = await axios.get(
//     //   `http://3.108.237.156:9194/sport/get_odds`
//     `http://universities.hipolabs.com/search?country=United+States`
//   );
//   console.log("Request sent to the API");
//   return apiResponse.data;
// }

// async function getOddsData(req, res) {
//   const sports = req.params.all;
//   console.log("sports",sports);
//   let results;

//   try {
//     results = await fetchApiData(sports);
//     if (results.length === 0) {
//       throw "API returned an empty array";
//     }
//     res.send({
//       fromCache: false,
//       data: results,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(404).send("Data unavailable");
//   }
// }

// app.get("/get_odds", getOddsData);

// app.listen(port, () => {
//   console.log(`Server started at ${port}`);
// });