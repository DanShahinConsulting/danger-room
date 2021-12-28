const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.classList.add('threedee')
$('#main').prepend( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
var sword;

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame( animate );

    //sword.rotation.x += 0.01;
    sword.rotation.y += 0.01;

    renderer.render( scene, camera );
};

const loader = new THREE.GLTFLoader();

loader.load( 'models/sword.glb', function ( gltf ) {
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.geometry.center(); // center here
        }
    });
    gltf.scene.scale.set(3,3,3) // scale here
    sword = gltf.scene
    scene.add( sword );
}, (xhr) => xhr, ( err ) => console.error( e ));

animate();