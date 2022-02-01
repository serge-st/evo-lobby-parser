require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const casinoId = "bmnjwb3t7j5dd7oy";
const hostname = "uat1-everymatrix.evolutiongaming.com";
const site = "1000";

const casinoInfo = {
  casinoId: casinoId,
  hostname: hostname,
  token: (process.env.NODE_ENV && process.env.NODE_ENV === "production") ? process.env.PROD_TOKEN : "test123",
  site: site,
};

const initiateLobbyRequest = async ({ hostname, casinoId, token, site }) => {
  const authHash = Buffer.from(`${casinoId}:${token}`).toString('base64');

  const requestParams = {
    method: 'get',
    url: `https://${hostname}/api/lobby/v1/${casinoId}/state?gameVertical=rng&provider=redtiger`,
    headers: {
      Authorization: `Basic ${authHash}`
    }
  };

  try {
    const response = await axios(requestParams);
    const { data } = response;

    const allTableIds = Object.keys(data.tables);
    const result = allTableIds.filter(tableId => ( !data.tables[tableId].sitesBlocked.includes(site) && (data.tables[tableId].sitesAssigned.includes(site) || data.tables[tableId].sitesAssigned.length == 0) ) );

    console.log(JSON.stringify(result));

    // fs.writeFile(__dirname + "/output.txt", JSON.stringify(result), err => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("No errors, file written succesfully");
    // });
    
    // console.log(JSON.stringify(data.tables));
  } catch (error) {
    console.error(error);
  }
};

initiateLobbyRequest(casinoInfo);