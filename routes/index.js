
var express = require('express');
var router = express.Router();
var util = require("util");
var Promise = require('promise'); 
var Entities = require('html-entities').AllHtmlEntities;

router.get('/apiver', function(req, res) {
    res.json({ message: 'welcome to My api ver 0.1! This API Powered by Chuk Norris power' });   
});

router.get('/', 
				function(req, res) {
										 res.render('layout');
									}


	);




module.exports = router;