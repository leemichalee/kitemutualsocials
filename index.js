const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || "8000";
const AWS = require('aws-sdk');
const { json } = require("body-parser");
const { platform } = require("os");
const { send } = require("process");
AWS.config.loadFromPath('./credentials.json');
app.use(express.urlencoded({extended: true}))
app.use(express.json())

let docClient = new AWS.DynamoDB.DocumentClient();

// app.get("/", (req,res) => {
//     res.status(200).send("Great! Express app is listening")
// });


app.get("/",(req,res) => {
    let body=req.body;

    let params = {
        TableName: "kitemutualsocials",
        ProjectionExpression: "platform, link",
    };
    docClient.scan(params, function(err,data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            res.status(200).send(data.Items)
            data.Items.forEach(function(table) {
               console.log(
                   table.platform,
                    table.link);
            });
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    })
})

app.listen(port, () => {
    console.log("Listening at", port)
})