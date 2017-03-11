/*
TODO

    текстуры на стены
    http://jsfiddle.net/C5dga/13/
    рисовать мышкой

*/                
var scene, camera, 
    cameraPosition, cameraX, 
    cameraY, cameraZ, gui, 
    controls, sceneJson, exporter;

                
var renderer = new THREE.WebGLRenderer();
                
var scene = new THREE.Scene();
                
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var cameraX = 90;
                
var cameraY = 75; 
                
var cameraZ = 250;  

function draw_texture() 
{
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;    
  var ctx = canvas.getContext('2d');
  ctx.drawImage(document.getElementById('front'), 0, 0);
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
} // draw_texture
                
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
                var planeGeometry = new THREE.PlaneGeometry(160,220);
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
                        
        var shape = new THREE.Shape();
                        
                        shape.moveTo( 0,0 );
                        
                        shape.lineTo( 0, width );
                        
                        shape.lineTo( length, width );
                        
                        shape.lineTo( length, 0 );
                        
                        shape.lineTo( 0, 0 );

                        
        var extrudeSettings = {
                        steps: 1,
                        
                        amount: 90,
                        
                        bevelEnabled: false,
                        
                        bevelThickness: 0.5,
                        
                        bevelSize: 0.5,
                        
                        bevelSegments: 8,
                        
                        UVGenerator: THREE.ExtrudeGeometry.BoundingBoxUVGenerator
         };

        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
          
        var canvas = document.createElement('canvas');
        canvas.setAttribute("id", "canvas");

        var grid = 250;
        
        canvas.width = grid;

        canvas.height = grid;

        document.body.appendChild(canvas);
                
        var ctx = canvas.getContext('2d');
            
        var map = new THREE.Texture(canvas);

                
        // load an image
        var imageObj = new Image();
        
        imageObj.src = '/public/images/br.jpg';
        // after the image is loaded, this function executes
        imageObj.onload = function()
        {  
            ctx.drawImage(imageObj, 0, 0);
            if ( map ) {// checks if texture exists
                map.needsUpdate = true;
            }
        };  
    
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT =false;
        map.anisotropy = 1;
        map.flipY=false;

        map.repeat.set(1, 1);

        
        
    
        //var material = new THREE.MeshLambertMaterial( { color: 0xff6600, map:draw_texture()} );
        var material = new THREE.MeshLambertMaterial( { color: 0xffffff, map:map} );
                           
        var mesh = new THREE.Mesh( geometry, material ) ;

                            mesh.rotation.y += 0.02;

                            mesh.castShadow = true;

                            scene.add( mesh );
                            //Iwanaseezelight                 
        var lights = [];
        
            lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            
            lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            
            lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

            lights[ 0 ].position.set( 0, 200, 0 );
            
            lights[ 1 ].position.set( 100, 200, 100 );
            
            lights[ 2 ].position.set( - 100, - 200, - 100 );

            
            scene.add( lights[ 0 ] );
            
            scene.add( lights[ 1 ] );
            
            scene.add( lights[ 2 ] ); 

        var spotLight = new THREE.SpotLight( 0xffffff );

                            spotLight.position.set( 120, 120, 100 );

                            spotLight.castShadow = true;
                            
                            scene.add(spotLight);

                            camera.lookAt(new THREE.Vector3(0, 0, 0));

                            camera.position.set(cameraX, cameraY, cameraZ);
                            
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
                            this.importScene = function () {
                              
                                
        var loader = new THREE.OBJLoader();
                                loader.load('scene.json', function ( object )
                                {
                                    //object.position.x = - 60;
                                    //object.rotation.x = 20* Math.PI / 180;
                                    //object.rotation.z = 20* Math.PI / 180;
                                    //object.scale.x = 30;
                                    //object.scale.y = 30;
                                    //object.scale.z = 30;
                                    obj = object;    
                                        scene.add( obj );
                                        animate();
                                    });
                                }
                            };

                            gui = new dat.GUI();

                            gui.add(controls, "exportScene");

                            gui.add(controls, "clearScene");

                            gui.add(controls, "importScene");
                    
                    
                    
                } // end init
                
                
var render = function () 
                {
                        renderer.render(scene, camera);
                };
                
                function animate() 
                {
                    requestAnimationFrame( animate );
                    render();
                }
                    
                $( "body" ).mouseup(function() 
                {
                    // objcoord
                        $.post( "/api/put_coord", { "x": camera.position.x, "y": camera.position.y, "z":camera.position.z })

                            .done(function( data ) {

                                 console.log( "Data to SERVER posted and recieved : " + data );
                        });

                         console.log('cameraPOS --> '+camera.position.x);
                    });
                $( document ).ready( function() {

                                    $.get("/api/get_coord")

                                     .done(function(data) 

                                      {
                                     // if load last camera position 
                                         if ( data != "404"){

                                             console.log("START Data Loaded camera XYZ: " + data.x + " "+data.y + " " +data.y );

                                             cameraX = data.x;

                                             cameraY = data.y; 

                                             cameraZ = data.z;    
                                         }
                                         init();

                                         animate();
                                     })
                                    .fail(function() 
                                    {
                                    //console.log("if fail, initiate scene and render, init with def. coord: "+cameraX+" "+cameraY+" "+cameraZ);
                                    // if fail, initiate scene and render
                                            init();
                                            animate();

                                    })
                                  });