const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

const jsonData = JSON.stringify(data);

//replace usX with your server and list_id with your mailing list id.
const url = "https://usX.api.mailchimp.com/3.0/lists/{list_id}";

//replace username and api_key with your username and api_key
const options = {
  method: "POST",
  auth: "username:<api_key>"
}

const request = https.request(url, options, function(response) {

  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html");
  }

  response.on("data", function(data){
    JSON.parse(data);
  });
});

request.write(jsonData);
request.end();

});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
