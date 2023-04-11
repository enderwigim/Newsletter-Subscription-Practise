const express = require("express");
const https = require('node:https');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { subscribe } = require("node:diagnostics_channel");

// Express
const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    mailchimp.setConfig({
        apiKey: "6609bfc7719d2a67432c282a922633c3-us17",
        server: "us17",
      });
      
      async function run() {
        const response = await mailchimp.lists.batchListMembers("2a4fc7a27c", {
            members: [
                {
                email_address: email,
                email_type: "text",
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
    
        }],});
        
        if (response.new_members.length === 0 && response.errors.length != 0){
            res.sendFile(__dirname + "/failure.html");
        } else {
            res.sendFile(__dirname + "/success.html");
        }
      }
      
      run();
});
    
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/failure", function(req, res){
    res.redirect("/")
})
app.listen(port, function(){
    console.log("Listening at port 3000");
});



