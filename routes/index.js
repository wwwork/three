
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


 function writeToJsonFile ( fn,data ){ 
        
		fs.writeFile(fn, 
		    
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
	
	    writeToJsonFile('coord.json', cords ); 
		res.header("Content-Type", "application/json; charset=utf-8")
		res.send( cords );
	    
    
} // end putCoord

// get scene items from browser

function putScene (req, res){
    // Set our internal DB variable
        var scene = JSON.stringify(req.body.scene);
		    //console.log(scene);
		    console.log(util.inspect(scene));
        // If it failed, return error
	    fs.writeFileSync('scene.json',  scene);
		
	    //writeToJsonFile('scene.json', scene ); 
		
		res.header("Content-Type", "application/json; charset=utf-8")
		res.send( scene );
} // end putScene

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
// put scene_to_serv
router.post('/api/put_scene', putScene);


module.exports = router;