let express = require('express');
var app = express();
var router = express.Router()


app.use('/', router);
router.get('/', function(req, res) {
    res.send( "hi");
});

app.listen(3000, '0.0.0.0');