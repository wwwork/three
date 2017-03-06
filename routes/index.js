
var express = require('express');
var router = express.Router();
var util = require("util");
var Promise = require('promise'); 
var Entities = require('html-entities').AllHtmlEntities;
var fs = require("fs");

// read from file 
function dataToJson( data ) {
    return JSON.stringify( data ) ;
    
} // end dataToJson


 function writeToJsonFile ( data ){ 
        
		fs.writeFile('coord.json', 
		    
			dataToJson(data),
            
			function ( err ) {
                
				if ( err ) { 
                    
					return console.log( 'err write ti json ' + err );
                
				}//end err
            
			}); // end writeFile
                        
    } // end     writeToJsonFile
	
function  getCoord(req, res) {
	// Check that the file exists locally
    if(!fs.existsSync('coord.json')) {
		console.log( '404, send  init coords');
        res.send( '404' ); 
    } else {
	    fs.readFile( 
            'coord.json', 
            'utf8', 
            function (err, data) {
                // data = dataToJson( data ) ;
                 console.log('reaing current ccache ====> ' + data );
				 res.header("Content-Type", "application/json; charset=utf-8");
				 res.send( data ); 
                 
                 }); // end fs.readFile
    } // end else 
}

function putCoord (req, res){
	
    // Set our internal DB variable
        var cords = req.body;
		    console.log(util.inspect(cords));
    // Set our collection
    // If it failed, return error
	
	    writeToJsonFile( cords ); 
		res.header("Content-Type", "application/json; charset=utf-8")
		res.send( cords );
	    
    
} // end putCoord

router.get('/apiver', function(req, res) {
    res.json({ message: 'welcome to My api ver 0.1! This API Powered by Chuk Norris power' });   
});

router.get('/', 
				function(req, res) {
										 res.render('layout');
									}


	);
// read last coord from file
router.get('/api/get_coord', getCoord);
// put last coord to file
router.post('/api/put_coord', putCoord);



module.exports = router;