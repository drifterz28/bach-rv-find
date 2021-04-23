require('dotenv').config();
const http = require("http");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const startDate = "2021-05-28";
const endDate = "2021-05-29";

const headers = {
  headers: {
    accept: "application/vnd.api+json",
    "accept-language": "en-US,en;q=0.9",
    authorization: "Key ab465bd4-678c-4dc2-a6bd-78364187cf72",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "session-id": "333c99c2-323c-4f66-ac63-17a6424c971e",
    "x-request-id": "0b1ea97a7b8a426db95a6545773efb32",
    "x-requested-with": "XMLHttpRequest",
  },
  referrer: "https://book.peek.com/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
  mode: "cors",
  credentials: "include",
};

const pass = process.env.PASS;
const port = process.env.PORT || 5000;

async function main() {

  let transporter = nodemailer.createTransport({
    host: "smtp.privateemail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "info@powalerts.com",
      pass
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Pow Alerts ⛰️" <info@powalerts.com>', // sender address
    to: "chris@chriswhitney.com", // list of receivers
    subject: "There are spots", // Subject line
    html:
      "<h2>It looks like spots are open <br/> https://www.mtbachelor.com/plan-your-trip/mountain-services/overnight-rv-camping</h2>",
  });
  console.log(info)
}

const server = http.createServer(async (req, res) => {
  const unpowered = await fetch(
    `https://book.peek.com/services/api/availability-dates?activity-id=f63a3d43-0c70-4926-953d-dc3b9c919ba2&c=&end-date=${endDate}&include=&namespace=b95a37ce-237f-41a1-8ad6-e4ca0e0f6db1&start-date=${startDate}&tickets%5B0%5D%5Bticket-id%5D=598c88df-e95a-4bdd-adba-44d245dc7016&tickets%5B0%5D%5Bquantity%5D=2&use-legacy-api=false`,
    headers
  ).then((data) => data.json());
  const powered = await fetch(
    `https://book.peek.com/services/api/availability-dates?activity-id=16e0b92f-353b-47b1-8bdd-3149922791ea&c=&end-date=${endDate}&include=&namespace=c74c48ec-9726-4347-fe4f-78141fb78b41&start-date=${startDate}&tickets%5B0%5D%5Bticket-id%5D=10430f45-c583-4c1d-b9db-e727b644d95d&tickets%5B0%5D%5Bquantity%5D=2&use-legacy-api=false`,
    headers
  ).then((data) => data.json());
  const dates = [...powered.data, ...unpowered.data];
  const avaliableDates = dates.filter(
    (date) => date.attributes["availability-status"] === "available"
  );
  console.log(avaliableDates.length);

  if(avaliableDates.length > 0) {
    main();
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    "<html><head></head><body>Nothing to see here</body></html>"
  );
  res.end();
});

server.listen(port); //3 - listen for any incoming requests

console.log("Node.js web server at port 5000 is running..");
