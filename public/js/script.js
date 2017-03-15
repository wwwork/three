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
		
*/                
var scene, camera, 
    cameraPosition, cameraX, 
    cameraY, cameraZ, gui, 
    controls, sceneJson, exporter,
    mesh, wallCount, coord = [], objects = [];


var renderer = new THREE.WebGLRenderer();
                
var scene = new THREE.Scene();
                
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000 );

var cameraX = 0;
                
var cameraY = 150; 
                
var cameraZ = 250;  

var projector;

var wallHeight = 90;

var clickCount = 0;

var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();

var pos = new THREE.Vector3();

var intersects;


                
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
							
			newshape.moveTo( coord['0'].x, -coord['0'].z );
			
			newshape.lineTo( coord['1'].x, -coord['1'].z );
							
			newshape.lineTo( coord['2'].x, -coord['2'].z );
							
			newshape.lineTo( coord['3'].x, -coord['3'].z );
							
			newshape.lineTo( coord['0'].x, -coord['0'].z );
			
							
			var newextrudeSettings = {
				
				teps: 1,
                        
                amount: wallHeight,
                        
                bevelEnabled: false,
                        
                bevelThickness: 0.5,
                        
                bevelSize: 0.5,
                        
                bevelSegments: 8,
						
				UVGenerator: THREE.ExtrudeGeometry.BoundingBoxUVGenerator
			 };

			var newgeometry = new THREE.ExtrudeGeometry( newshape, newextrudeSettings );
				
				newgeometry.rotateX(-Math.PI / 2);
			// load a texture, set wrap mode to repeat
			var newtexture = new THREE.TextureLoader().load( '/public/images/br.jpg' );
			
			newtexture.wrapS = THREE.RepeatWrapping;
			
			newtexture.wrapT = THREE.RepeatWrapping;
		
			newtexture.repeat.set( 0.011, 0.011 );

			var newmaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map:newtexture} );
							   
			var newmesh = new THREE.Mesh( newgeometry, newmaterial ) ;

			//newmesh.rotation.y += 0.02;

			newmesh.castShadow = true;
								
			scene.add( newmesh );
			
			clickCount = 0;
			
			coord = [];
			
			document.removeEventListener('mousedown', onDocumentMouseDown, false);
			
		}    
			
	} // eif							
                        //}
                        
                      
                        // TODO: handle exception
                    
/*                        var wallCount + = new THREE.Mesh( geometry, material ) ;

                        meshNewWall.castShadow = true;
                        
                        meshNewWall.position.set( 40, 0, -30 );
                        
                        console.log('meshNewWall ' + meshNewWall);

                        scene.add( meshNewWall );*/
                        return 0;

} // onDocumentMouseDown
                
//var rotateY = new THREE.Matrix4().makeRotationY( 0.005 );
                
var render = function () 
{
        //camera.applyMatrix( rotateY );
        //camera.updateMatrixWorld();
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
        
        var orbit = new THREE.OrbitControls( camera, renderer.domElement );
        
        orbit.enableZoom = true;

        var axes = new THREE.AxisHelper( 20 );

        scene.add(axes);

		scene.fog = new THREE.Fog( 0xffffff, 2000, 10000 );
        
        // instantiate a loader
        var loader = new THREE.TextureLoader();

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
                     
                var plane = new THREE.Mesh(planeGeometry,planeMaterial);
                
                plane.rotation.x = -0.5*Math.PI;
                
                plane.receiveShadow = true;
                
                scene.add(plane);
				objects.push(plane);
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

        //mesh.rotation.y += 0.02;

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
       
	    var lights = [];
        
        
        var spotLight = new THREE.SpotLight( 0xffffff );

        spotLight.position.set( 120, 120, 100 );

        spotLight.castShadow = true;
                        
        scene.add(spotLight);
		
		var light = new THREE.DirectionalLight(0xffffff, 2);
			
		light.position.set(5, 10, -10);
			
		scene.add(light);

        camera.lookAt(scene.position);

        camera.position.set(cameraX, cameraY, cameraZ);
                        
        controls = new function () 
        {
                this.exportScene = function () 
                {
					/*
					var exporter = new THREE.SceneExporter();
					var sceneJson = JSON.stringify(exporter.parse(scene));
					*/
					result = mesh.toJSON();
                    console.log(result);
                    //console.log(JSON.stringify(result));
                        
                    $.post( "/api/put_scene", {"scene":result})
                        .done(function( data ) {
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
                        //wait 4 clicks
                        //after read mouse Y after update
                        //add wal with coordinates
                   document.addEventListener( 'mousedown', onDocumentMouseDown, false );
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
                        init();

                        animate();

 
                    });