"use strict";
exports.__esModule = true;
var express_1 = require("express");
var util_1 = require("./module/util");
var app = express_1["default"]();
var PORT = 3333;
app.get('/', function (req, res) {
    res.send("Success request " + util_1["default"]());
});
app.listen(PORT, function () {
    return console.log('Server started on PORT ', PORT);
});
