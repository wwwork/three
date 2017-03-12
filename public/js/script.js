/*
TODO

    текстуры на стены
    http://jsfiddle.net/C5dga/13/
	// 
    // имопортировать диван
	// считать все обекты в json
	
*/                
var scene, camera, 
    cameraPosition, cameraX, 
    cameraY, cameraZ, gui, 
    controls, sceneJson, exporter,
	mesh, wallCount;


var renderer = new THREE.WebGLRenderer();
                
var scene = new THREE.Scene();
                
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var cameraX = 90;
                
var cameraY = 75; 
                
var cameraZ = 250;  

var projector, mouse = { x: 0, y: 0 };

var wallHeight = 90;

var clickCount = 0;
var coord = {};
				
var onDocumentMouseDown = function ( event ) 
{
	
	// event.preventDefault();
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;

	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	console.log('mouse.x ' + mouse.x);

	console.log('mouse.y ' + mouse.y);

	
	if (clickCount <= 3){
		
		
		
		
		
		
		coord[clickCount] = {'x' : mouse.x, 'y' : mouse.y};
		
		//console.log('clickCount ' + clickCount);
		
		//console.log(clickCount+' mouse_x mouse_y ' + JSON.stringify(coord));
		clickCount ++;
		
	} else {
		
		console.log('0 mouse_x ' + coord['0'].x + ' mouse_y ' +coord['0'].y);
		console.log('1 mouse_x ' + coord['1'].x + ' mouse_y ' +coord['1'].y);
		console.log('2 mouse_x ' + coord['2'].x + ' mouse_y ' +coord['2'].y);
		console.log('3 mouse_x ' + coord['3'].x + ' mouse_y ' +coord['3'].y);
		
		
		
		
	console.log('mesh.geometry ' +  JSON.stringify(mesh));		
	//console.log('mesh.geometry ' +  JSON.stringify(mesh.geometry.vertices[1].y));		
		
		// make new wall and stop function
        newshape = new THREE.Shape();
                        
                        shape.moveTo(  coord['0'].x ,coord['0'].y );
                        
                        shape.lineTo( coord['0'].x, coord['1'].y );
                        
                        shape.lineTo( coord['2'].x, +coord['2'].y );
                        
                        shape.lineTo( coord['3'].x, coord['3'].y );
                        
                        shape.lineTo( coord['0'].x, coord['0'].y );

                        
        var newextrudeSettings = {
                        steps: 1,
                        
                        amount: wallHeight,
                        
                        bevelEnabled: false,
                        
                        bevelThickness: 0.5,
                        
                        bevelSize: 0.5,
                        
                        bevelSegments: 8,
                        
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
		
		clickCount = 0;
		
		document.removeEventListener('mousedown', onDocumentMouseDown, false);
		
		console.log(' function mouse stopped');
					 
	}	
		
							
						//}
						
				 	 
						// TODO: handle exception
					
/*						var wallCount + = new THREE.Mesh( geometry, material ) ;

									meshNewWall.castShadow = true;
									
									meshNewWall.position.set( 40, 0, -30 );
									
									console.log('meshNewWall ' + meshNewWall);

									scene.add( meshNewWall );*/
							return 0;

} // onDocumentMouseDown
                
                
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
        
        var orbit = new THREE.OrbitControls( camera, renderer.domElement );
        
        orbit.enableZoom = true;

        var axes = new THREE.AxisHelper( 20 );

        scene.add(axes);

        // instantiate a loader
        var loader = new THREE.TextureLoader();

        // load a resource
        loader.load(
            // resource URL
            '/public/images/bricks.jpg',
            // Function when resource is loaded
            function ( texture ) 
            {
                var planeGeometry = new THREE.PlaneGeometry(1000,1000,10, 10);
                // do something with the texture
                var planeMaterial = new THREE.MeshLambertMaterial( {
                    color: 0xcccccc, 
                    map: texture
                 } );
                     
                var plane = new THREE.Mesh(planeGeometry,planeMaterial);
				
                plane.rotation.x = -0.5*Math.PI;
                
				plane.position.x = 15;

				plane.position.y = 0;

				plane.position.z = 0;

				plane.receiveShadow = true;
                
				scene.add(plane);
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
			var lights = [];
        
            lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            
            lights[ 0 ].position.set( 0, 200, 0 );

            scene.add( lights[ 0 ] );

           

			var spotLight = new THREE.SpotLight( 0xffffff );

                            spotLight.position.set( 120, 120, 100 );

                            spotLight.castShadow = true;
                            
                            scene.add(spotLight);

                            camera.lookAt(scene.position);

                            camera.position.set(50, 150, 200);
							
                            //camera.position.set(cameraX, cameraY, cameraZ);
                            
                            controls = new function () 
                            {
                               this.exportScene = function () 
                               {
                                        exporter = new THREE.OBJExporter();

                                        result = exporter.parse(scene);
                                    
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
									
									/*
									mesh.geometry.vertices[1].y=400;		
									mesh.geometry.computeFaceNormals();
									mesh.geometry.computeVertexNormals();
									mesh.geometry.normalsNeedUpdate = true;
									mesh.geometry.verticesNeedUpdate = true;
									mesh.geometry.dynamic = true;
									*/
									
	
											
											
											
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