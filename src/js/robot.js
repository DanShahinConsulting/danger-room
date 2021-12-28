let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

const api = { state: 'Walking' };

init();
animate();

function init() {
                // container = document.createElement( 'div' );
				// document.body.appendChild( container );

                
                
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
				camera.position.set( -3, 4, 10 );
				camera.lookAt( new THREE.Vector3( 0, 3, 0 ) );

				scene = new THREE.Scene();
				//scene.background = new THREE.Color( 0xe0e0e0 );
				//scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

				clock = new THREE.Clock();

				// lights

				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
                hemiLight.castShadow = true;
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 0, 20, 10 );
                dirLight.castShadow = true;
				scene.add( dirLight );

                

				// ground

				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.ShadowMaterial( { color: 0xffffff, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
                mesh.material.opacity = 1;

                mesh.receiveShadow = true;
				scene.add( mesh );

				const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
				grid.material.opacity = 1;
				grid.material.transparent = false;
				//scene.add( grid );

				// model

				const loader = new THREE.GLTFLoader();
				loader.load( 'models/RobotExpressive.glb', function ( gltf ) {

					model = gltf.scene;
                    model.position.set( 0, 0, 0 );
					scene.add( model );
                    model.castShadow = true;

					createGUI( model, gltf.animations );

				}, undefined, function ( e ) {

					console.error( e );

				} );

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true  } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.domElement.classList.add('threedee')
                renderer.domElement.classList.add('robot')
                $('#main').prepend( renderer.domElement );

                controls = new THREE.OrbitControls( camera, renderer.domElement );
                controls.enablePan = false;
                controls.enableZoom = true;
			    controls.enableDamping = true;
                controls.target.set( 0, 2, 0 );
                controls.update();
                

				window.addEventListener( 'resize', onWindowResize );

				// stats
				// stats = new Stats();
				// container.appendChild( stats.dom );
                window.addEventListener( 'keyup', function ( event ) {
                        switch ( event.keyCode ) {
                            // RIGHT
                            case 37:
                                api.State = 'Idle';
                                fadeToAction( 'Idle', 1 );
                            // UP
                            case 39:
                                api.State = 'Idle';
                                fadeToAction( 'Idle', 1 );
                            // LEFT
                            case 38:
                                api.State = 'Idle';
                                fadeToAction( 'Idle', 1 );
                            //DOWN
                            case 40:
                                api.State = 'Idle';
                                fadeToAction( 'Idle', 1 );
                    }
                });
                window.addEventListener( 'keydown', function ( event ) {
                    let increment = 0.25;
                    let emoteSpeed = 0.2;
                    let stateSpeed = 0.5;

                    switch ( event.keyCode ) {
            
                        // R
                        case 82:
                            controls.target.set( 0, 2, 0 );
                            camera.position.set( -3, 4, 10 );
				            camera.lookAt( new THREE.Vector3( 0, 3, 0 ) );
                            controls.update();
                            break;
            
                        
                        // UP ARROW
                        case 38:
                            //model.position.z += increment;
                            if(api.State !== 'Walking'){
                                api.State = 'Walking';
                                fadeToAction( 'Walking', stateSpeed );
                            }
                            model.translateZ( increment );
                            break;
                        //LEFT ARROW
                        case 39:
                            if(api.State !== 'Walking'){
                                api.State = 'Walking';
                                fadeToAction( 'Walking', stateSpeed );
                            }
                            model.rotation.y -= increment;
                            //model.translateX( - increment );
                            break;

                        // DOWN ARROW
                        case 40:
                            if(api.State !== 'Walking'){
                                api.State = 'Walking';
                                fadeToAction( 'Walking', stateSpeed );
                            }
                            model.translateZ( - increment );
                            break;
                        // RIGHT
                        case 37:
                            if(api.State !== 'Walking'){
                                api.State = 'Walking';
                                fadeToAction( 'Walking', stateSpeed );
                            }
                            model.rotation.y += increment;
                            //model.translateX( increment );
                            break;

                        // page up
                        case 33:
                            model.translateY( increment );
                            //model.position.y += increment;
                            break;

                        // page down
                        case 34:
                            model.translateY( - increment );
                            //model.position.y -= increment;
                            break;

                        //Q
                        case 81:
                            model.rotation.y += increment;
                            break;

                        //E
                        case 69:
                            model.rotation.y -= increment;
                            break;

                        //J
                        case 74:
                            fadeToAction( 'Jump', emoteSpeed );
                            break;

                        //Y
                        case 89:
                            fadeToAction( 'Yes', emoteSpeed );
                            break;

                        //N
                        case 78:
                            fadeToAction( 'No', emoteSpeed );
                            break;
                        
                        //G
                        case 87:
                            fadeToAction( 'Wave', emoteSpeed );
                            break;

                        //P
                        case 80:
                            fadeToAction( 'Punch', emoteSpeed );
                            break;
                        //T
                        case 84:
                            fadeToAction( 'ThumbsUp', emoteSpeed );
                            break;
                        
                        //1
                        case 49:
                            fadeToAction( 'Idle', stateSpeed );
                            break;
                        
                        //2
                        case 50:
                            fadeToAction( 'Walking', stateSpeed );
                            break;
                        
                        //3
                        case 51:
                            fadeToAction( 'Running', stateSpeed );
                            break;
                        
                        //4
                        case 52:
                            fadeToAction( 'Dance', stateSpeed );
                            break;
                        
                        //5
                        case 53:
                            fadeToAction( 'Death', stateSpeed );
                            break;

                        //6
                        case 54:
                            fadeToAction( 'Sitting', stateSpeed );
                            break;

                        //7
                        case 55:
                            fadeToAction( 'Standing', stateSpeed );
                            break;
            
                    }
            
                } );

			}

			function createGUI( model, animations ) {

				const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
				const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

				gui = new dat.GUI();

				mixer = new THREE.AnimationMixer( model );

				actions = {};

				for ( let i = 0; i < animations.length; i ++ ) {

					const clip = animations[ i ];
					const action = mixer.clipAction( clip );
					actions[ clip.name ] = action;

					if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {

						action.clampWhenFinished = true;
						action.loop = THREE.LoopOnce;

					}

				}

				// states

				const statesFolder = gui.addFolder( 'States' );

				const clipCtrl = statesFolder.add( api, 'state' ).options( states );

				clipCtrl.onChange( function () {

					fadeToAction( api.state, 0.5 );

				} );

				statesFolder.open();

				// emotes

				const emoteFolder = gui.addFolder( 'Emotes' );

				function createEmoteCallback( name ) {

					api[ name ] = function () {

						fadeToAction( name, 0.2 );

						mixer.addEventListener( 'finished', restoreState );

					};

					emoteFolder.add( api, name );

				}

				function restoreState() {

					mixer.removeEventListener( 'finished', restoreState );

					fadeToAction( api.state, 0.2 );

				}

				for ( let i = 0; i < emotes.length; i ++ ) {

					createEmoteCallback( emotes[ i ] );

				}

				emoteFolder.open();

				// expressions

				face = model.getObjectByName( 'Head_4' );

				const expressions = Object.keys( face.morphTargetDictionary );
				const expressionFolder = gui.addFolder( 'Expressions' );

				for ( let i = 0; i < expressions.length; i ++ ) {

					expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );

				}

				activeAction = actions[ 'Idle' ];
				activeAction.play();

				expressionFolder.open();

                gui.close();
                //move robotcontrols just below screen
                // $('.dg.ac').css({'top':'720px'});
			}

			function fadeToAction( name, duration ) {

				previousAction = activeAction;
				activeAction = actions[ name ];

				if ( previousAction !== activeAction ) {

					previousAction.fadeOut( duration );

				}

				activeAction
					.reset()
					.setEffectiveTimeScale( 1 )
					.setEffectiveWeight( 1 )
					.fadeIn( duration )
					.play();

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				const dt = clock.getDelta();

				if ( mixer ) mixer.update( dt );

				requestAnimationFrame( animate );

				renderer.render( scene, camera );

				//stats.update();

			}