var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/logout', function(req, res) {
		req.session.destroy();
    });

module.exports = router;
