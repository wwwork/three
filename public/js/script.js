/*
TODO

    текстуры на стены
    http://jsfiddle.net/C5dga/13/
    // 
    // имопортировать диван
    // считать все обекты в json
    https://stemkoski.github.io/Three.js/Mouse-Sprite.html
	https://www.jonathan-petitcolas.com/2015/07/27/importing-blender-modelized-mesh-in-threejs.html
	http://threejs.org/examples/webgl_loader_json_claraio.html
	http://stackoverflow.com/questions/17939188/how-can-i-load-multiple-textures-materials-to-a-model-using-three-js
    https://github.com/josdirksen/learning-threejs/blob/master/chapter-08/04-load-save-json-scene.html
	https://github.com/josdirksen/learning-threejs
	https://github.com/mrdoob/three.js/issues/3368
	
	https://gitlab.cern.ch/GeantV/geant/blob/master/threejs/04-load-save-json-scene.html
	http://stackoverflow.com/questions/33577539/three-js-load-json-string
	var json = geometry.toJSON();
		http://stackoverflow.com/questions/30959385/export-threejs-geometry-to-json

		
		http://stackoverflow.com/questions/42774885/uncaught-typeerror-cannot-read-property-length-of-null-three-js/42798440#42798440
		https://github.com/josdirksen/learning-threejs/blob/master/chapter-08/03-load-save-json-object.html
 move 	
https://www.script-tutorials.com/webgl-with-three-js-lesson-10/		                                    /*
                                    mesh.geometry.vertices[1].y=400;        
                                    mesh.geometry.computeFaceNormals();
                                    mesh.geometry.computeVertexNormals();
                                    mesh.geometry.normalsNeedUpdate = true;
                                    mesh.geometry.verticesNeedUpdate = true;
                                    mesh.geometry.dynamic = true;
                                    */
                                    
									
                
var scene, camera, 
    cameraPosition, cameraX, 
    cameraY, cameraZ, gui, 
    controls, sceneJson, exporter,
    mesh, wallCount, coord = [], objects = [], selection = null, plane = null;

var offset = new THREE.Vector3();

var renderer = new THREE.WebGLRenderer();
                
var scene = new THREE.Scene();
                
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000 );

var cameraX = 90;
                
var cameraY = 75; 
                
var cameraZ = 250;  

var projector;

var wallHeight = 90;

var clickCount = 0;

var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();

var pos = new THREE.Vector3();

var intersects;

var orbit = new THREE.OrbitControls( camera, renderer.domElement );

orbit.target = new THREE.Vector3(0, 0, 0);

orbit.maxDistance = 1550;

var onDocumentMouseDown = function ( event ) 
{
    event.preventDefault();
    // update the mouse variable
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	raycaster.setFromCamera(mouse, camera);
        
	intersects = raycaster.intersectObjects(objects); //    
	
    if (intersects.length > 0) { 
    
		if (clickCount <= 3){

			coord[clickCount] = intersects[0].point.clone(); 
			
			console.log('xyz ' + coord[clickCount].x +' '+ coord[clickCount].y + ' '+ coord[clickCount].z);    
			
			clickCount ++;
			
		} else {		
			// make new wall and stop function
			newshape = new THREE.Shape();
							
			newshape.moveTo(coord['0'].x, -coord['0'].z );
			
			newshape.lineTo(coord['1'].x, -coord['1'].z );
							
			newshape.lineTo(coord['2'].x, -coord['2'].z );
							
			newshape.lineTo(coord['3'].x, -coord['3'].z );
							
			newshape.lineTo(coord['0'].x, -coord['0'].z );
			
							
			var newextrudeSettings = {
				
				steps: 1,
				
				amount: wallHeight,
				
				bevelEnabled: false,
				
				UVGenerator: THREE.ExtrudeGeometry.BoundingBoxUVGenerator
			 };

			var newgeometry = new THREE.ExtrudeGeometry( newshape, newextrudeSettings );
		
			// load a texture, set wrap mode to repeat
			var newtexture = new THREE.TextureLoader().load( '/public/images/br.jpg' );
			
			newtexture.wrapS = THREE.RepeatWrapping;
			
			newtexture.wrapT = THREE.RepeatWrapping;
		
			newtexture.repeat.set( 0.011, 0.011 );

			var newmaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map:newtexture} );
							   
			var newmesh = new THREE.Mesh( newgeometry, newmaterial ) ;

			newmesh.rotation.y += 0.02;

			newmesh.castShadow = true;
								
			scene.add( newmesh );
								
			objects.push( newmesh );
			
			clickCount = 0;
			
			coord = [];
			
			document.removeEventListener('mousedown', onDocumentMouseDown, false);
			
			console.log(' function onDocumentMouseDown  stopped');
			// add global listener 
			document.addEventListener( 'mousedown', onDocumentMouseDownGlobal, false );
			
			console.log(' function onDocumentMouseDownGlobal  STARTED');
			
			console.log(' function mouse stopped');
			//var objectsjson = objects.toJSON(); 
			//var objectsjson = JSON.stringify(myObj.toJSON());
			console.log(' objects.toJSON()  --> ' + objectsjson);
						 
		}    
			
	} // eif							

	return 0;

} // onDocumentMouseDown


var onDocumentMouseDownGlobal = function (event) {
	
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	
	// Get mouse position
	console.log('GLOBAL onDocumentMouseDownGlobal ENABLE'); 

	var mouseX = (event.clientX / window.innerWidth) * 2 - 1;

	var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	// Get 3D vector from 3D mouse position using 'unproject' function
	var vector = new THREE.Vector3(mouseX, mouseY, 1);

	vector.unproject(camera);

	// Set the raycaster position
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	// Find all intersected objects
	var intersects = raycaster.intersectObjects(objects);

	if (intersects.length > 0) {

		// Disable the controls
		orbit.enabled = false;

		// Set the selection - first intersected object
		selection = intersects[0].object;

		// Calculate the offset
		var intersects = raycaster.intersectObject(plane);

		offset.copy(intersects[0].point).sub(plane.position);

	}

} // onDocumentMouseDownGlobal


var onDocumentMouseMove = function (event) {
	
	console.log('onDocumentMouseMove ENABLE');

	event.preventDefault();
	// Get mouse position

	var mouseX = (event.clientX / window.innerWidth) * 2 - 1;

	var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	// Get 3D vector from 3D mouse position using 'unproject' function

	var vector = new THREE.Vector3(mouseX, mouseY, 1);

	vector.unproject(camera);

// Set the raycaster position

	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	if (selection) {

		// Check the position where the plane is intersected
		var intersects = raycaster.intersectObject(plane);

		// Reposition the object based on the intersection point with the plane
		selection.position.copy(intersects[0].point.sub(offset));

	} else {

		// Update position of the plane if need

		var intersects = raycaster.intersectObjects(objects);

		if (intersects.length > 0) {

			plane.position.copy(intersects[0].object.position);

			plane.lookAt(camera.position);

		} // if 

	} // else 

} // end onDocumentMouseMove


var onDocumentMouseUp = function (event) {
	
	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	
	console.log('GLOBAL onDocumentMouseMove REMOVED'); 
	
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	
	console.log('GLOBAL onDocumentMouseUp REMOVED'); 
	
// Get mouse position
	
	// Enable the controls
	orbit.enabled = true;

	selection = null;

} // end onDocumentMouseUp





	   
var render = function () 
{
        renderer.render(scene, camera);
}; //render
               
var animate = function () 
{
       requestAnimationFrame( animate );
	   
       render();
} //animate

    
var init = function ()
{
    renderer.setSize( window.innerWidth, window.innerHeight );
            
    renderer.shadowMapEnabled = true;
             
    document.body.appendChild( renderer.domElement );
        
    orbit.enableZoom = true;

    var axes = new THREE.AxisHelper( 20 );

    scene.add(axes);

    // instantiate a loader
    var loader = new THREE.TextureLoader();
// Plane, that helps to determinate an intersection position
        // load a resource
        loader.load(
            // resource URL
            '/public/images/bricks.jpg',
            // Function when resource is loaded
            function ( texture ) 
            {
                var planeGeometry = new THREE.PlaneGeometry(1000,1000, 20, 20);
                // do something with the texture
                var planeMaterial = new THREE.MeshLambertMaterial( {
                    color: 0xcccccc, 
                    map: texture
                 } );
                     
                plane = new THREE.Mesh(planeGeometry,planeMaterial);
                
                plane.rotation.x = -0.5*Math.PI;
                
                plane.receiveShadow = true;
                
                scene.add(plane);

				//objects.push(plane);
            },
            // Function called when download progresses
            function ( xhr ) 
            {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) 
            {
                console.log( 'An error happened' );
            }
        );

    
        var length = 3, width = 50;
                        
        shape = new THREE.Shape();
                        
        shape.moveTo( 0,0 );
                        
		shape.lineTo( 0, width );
		
		shape.lineTo( length, width );
		
		shape.lineTo( length, 0 );
		
		shape.lineTo( 0, 0 );

        var extrudeSettings = {
                        steps: 1,
                        
                        amount: wallHeight,
                        
                        bevelEnabled: false,
                        
                        bevelThickness: 0.5,
                        
                        bevelSize: 0.5,
                        
                        bevelSegments: 8,
                        
                        UVGenerator: THREE.ExtrudeGeometry.BoundingBoxUVGenerator
         };

        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    
        // load a texture, set wrap mode to repeat
        var texture = new THREE.TextureLoader().load( '/public/images/br.jpg' );
        
        texture.wrapS = THREE.RepeatWrapping;
        
        texture.wrapT = THREE.RepeatWrapping;
    
        texture.repeat.set( 0.011, 0.011 );

        var material = new THREE.MeshLambertMaterial( { color: 0xffffff, map:texture} );
        
        
                           
        mesh = new THREE.Mesh( geometry, material ) ;

        mesh.rotation.y += 0.02;

        mesh.castShadow = true;
                            
        scene.add( mesh );
            
        
        //shape.curves.v1.x =50;
 
		var meshNewWall = new THREE.Mesh( geometry, material ) ;

        meshNewWall.rotation.y += 0.02;

		meshNewWall.castShadow = true;
			
		mesh.position.set( -50, 0, -25 );

		meshNewWall.position.set( 40, 0, -30 );

		meshNewWall.rotation.y = 17.30;

		scene.add( meshNewWall );

		objects.push(meshNewWall);
			
        var lights = [];
        
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            
        lights[ 0 ].position.set( 0, 100, 0 );

        scene.add( lights[ 0 ] );

        var spotLight = new THREE.SpotLight( 0xffffff );

        spotLight.position.set( 120, 220, 200 );

        spotLight.castShadow = true;
                            
        scene.add(spotLight);
			
		var light = new THREE.DirectionalLight(0xffffff, 2);
			
		light.position.set(5, 10, -10);
			
		scene.add(light);

        camera.lookAt(scene.position);

        camera.position.set(0, 150, 200);
                            
        controls = new function () 
        {
			this.exportScene = function () 
				{
					result = exporter.parse(scene);
                    
					$.post( "/api/put_scene", {"scene":result})
					.done(function( data ) 
					{
						console.log( "Data to SERVER posted and recieved : " + data );
					});

					console.log(result);
                };
                this.clearScene = function () 
                {
					scene = new THREE.Scene();

					console.log('scene cleared');
                
				};
                    
				this.importScene = function () 
				{
                    var loader = new THREE.OBJLoader();

					loader.load('scene.json', function ( object )
					{
					    obj = object;    
							
						scene.add( obj );
							
						animate();
					});
                }
				this.addWall = function () 
				{
					    // remove orbit controls
					orbit.enabled = false;
						
					document.removeEventListener( 'mousedown', onDocumentMouseDownGlobal, false );
									
					console.log('GLOBAL onDocumentMouseDownGlobal REMOVED --> ADDWALL');
                                    
					document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				
				    console.log('GLOBAL onDocumentMouseDown ADDED --> ADDWALL  ');
                };
        };

    gui = new dat.GUI();

    gui.add(controls, "exportScene");

    gui.add(controls, "clearScene");

    gui.add(controls, "importScene");
                            
    gui.add(controls, "addWall");
                            
    projector = new THREE.Projector();
                            
                            
                    
                    
} // end init

                    
                    
$( document ).ready( function() 
{
	document.addEventListener( 'mousedown', onDocumentMouseDownGlobal, false );
	
	console.log('onDocumentMouseDownGlobal ADDED --> on startUP  ');
						
	init();

	animate();

 
});