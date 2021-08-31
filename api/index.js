var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send({
        api: "API_KEYTS5Q5H4EBFHIHT4WK6KB583OZ2HS8ZJJ",
        websocket: "SOCKET_KEYFEHvG9MMnnGX5JhQ8mVJsw527EMDPAq3MKkETjUV55QQC33y"
    })
})

module.exports = {
    path: "/finage-keys",
    handler: app
}