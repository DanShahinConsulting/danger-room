let sceneJson ;
console.log({sceneJson})
let scene;
const webcamCanvas = document.createElement('canvas') 
webcamCanvas.width = 1280   
webcamCanvas.height = 720
const webcamTexture =  THREE.Texture = new THREE.Texture(webcamCanvas)
webcamTexture.minFilter = THREE.LinearFilter
webcamTexture.magFilter = THREE.LinearFilter
const material = new THREE.ShaderMaterial({
    transparent: true,
    side : THREE.DoubleSide,
    uniforms: {
        map: { value: webcamTexture },
        side: THREE.DoubleSide,
        keyColor: { value: [0.0, 1.0, 0.0] },
        similarity: { value: 0.67 },
        smoothness: { value: 0.0 },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
});

const geometry =  new THREE.PlaneGeometry();
let plane =  new THREE.Mesh(geometry, material) ;
const boxHelper = new THREE.BoxHelper(plane, 0xff0000) ;

if(sceneJson){
    scene = new THREE.ObjectLoader().parse( JSON.parse(localStorage.getItem('userScene') ) );
    plane = scene.getObjectByName('screen')
   
}else{
    scene = new THREE.Scene();
    plane.add(boxHelper)
    plane.name = 'screen';
    plane.scale.x = 16 /3
    plane.scale.y = 9/3
    // plane.scale.z = 4
    scene.add(plane)
}

bindKeys();

const gridHelper = new THREE.GridHelper(10, 10)
    gridHelper.position.y = -1.5
    scene.add(gridHelper)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true  })
renderer.domElement.classList.add('threedee')
//renderer.domElement.classList.add('robot')
$('#main').prepend( renderer.domElement );
$('.threedee').css('z-index', 0);

let showControls = true;

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


camera.position.z = 5

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
const controls = new THREE.OrbitControls(camera, renderer.domElement)


const savedCamera = JSON.parse( localStorage.getItem( 'savedCamera' ) );
  if( savedCamera ){
    camera.position.copy( savedCamera.cameraPosition );
    controls.target.copy( savedCamera.targetPosition );
  }


controls.addEventListener( 'change', function(evt, foo){
    //console.log(evt, controls, camera.position)
    localStorage.savedCamera = JSON.stringify({
        cameraPosition: camera.position,
        targetPosition: controls.target
      });
} );

const webcam = document.createElement('video')

const canvasCtx = webcamCanvas.getContext('2d') 
canvasCtx.fillStyle = '#000000'
canvasCtx.fillRect(0, 0, webcamCanvas.width, webcamCanvas.height)

function vertexShader() {
    return `
        varying vec2 vUv;
        void main( void ) {     
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
    `
}
function fragmentShader() {
    return `
        uniform vec3 keyColor;
        uniform float similarity;
        uniform float smoothness;
        varying vec2 vUv;
        uniform sampler2D map;
        void main() {

            vec4 videoColor = texture2D(map, vUv);
     
            float Y1 = 0.299 * keyColor.r + 0.587 * keyColor.g + 0.114 * keyColor.b;
            float Cr1 = keyColor.r - Y1;
            float Cb1 = keyColor.b - Y1;
            
            float Y2 = 0.299 * videoColor.r + 0.587 * videoColor.g + 0.114 * videoColor.b;
            float Cr2 = videoColor.r - Y2; 
            float Cb2 = videoColor.b - Y2; 
            
            float blend = smoothstep(similarity, similarity + smoothness, distance(vec2(Cr2, Cb2), vec2(Cr1, Cb1)));
            gl_FragColor = vec4(videoColor.rgb, videoColor.a * blend); 
        }
    `
}

// const stats: Stats = Stats()
// document.body.appendChild(stats.dom)

var data = {
    keyColor: [0, 255, 0],
    similarity: 0.67,
    smoothness: 0.0,
    options : "Option 1"
}

const gui = new dat.GUI()
const folder = gui.addFolder("Visualization parameters")
folder.addColor(data, 'keyColor').onChange(() => updateKeyColor(data.keyColor))
folder.add(data, 'similarity', 0.0, 1.0).onChange(() => updateSimilarity(data.similarity))
folder.add(data, 'smoothness', 0.0, 1.0).onChange(() => updateSmoothness(data.smoothness))


function updateKeyColor(v) {
    material.uniforms.keyColor.value = [v[0] / 255, v[1] / 255, v[2] / 255]
}
function updateSimilarity(v) {
    material.uniforms.similarity.value = v
}
function updateSmoothness(v) {
    material.uniforms.smoothness.value = v
}
function updateOptions(v) {
    console.log(v)
    // data.deviceId = v;
    // data.options = v;
    var constraints = { 
        deviceId:  {exact: v},
         //audio: false, 
         video: {deviceId: v} 
    }
  console.log('constraints change', constraints)
    getStream(constraints)
}

function animate() {
    requestAnimationFrame(animate)

    //if (webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
    canvasCtx.drawImage(webcam, 0, 0, webcamCanvas.width, webcamCanvas.height)
    if (webcamTexture) webcamTexture.needsUpdate = true
    //}

    controls.update()

    render()

    //stats.update()
}

function render() {
    renderer.render(scene, camera)
}


function bindKeys(){

    window.addEventListener( 'keydown', function ( event ) {
        let increment = 0.1;
        event.preventDefault();
        switch ( event.keyCode ) {
            // LEFT
            case 72:
                showControls = !showControls;
                gridHelper.visible = showControls;
                boxHelper.visible = showControls;
                break;
            //numpad 8
            case 56:
                plane.rotateX(- increment)
                break;
            //numpad 2
            case 50:
                plane.rotateX(increment)
                break;
            //home key
            case 36:
                plane.rotation.y = 0;
                plane.rotation.x = 0;
                plane.rotation.z = 0;
                plane.position.y = 0;
                plane.position.x = 0;
                plane.position.z = 0;
                plane.scale.set(16/3 ,9/3,0);
                break;
            //end key
            case 35:
                plane.rotation.y = 0;
                plane.rotation.x = 0;
                plane.rotation.z = 0;
                plane.position.y = 0;
                plane.position.x = 0;
                plane.position.z = 3.1;
                break;
            //left arrow
            case 37:
                plane.translateX(- increment)
                break;
            //right arrow
            case 39:
                plane.translateX(increment)
                break;
            //left arrow
            case 38:
                plane.translateY( increment)
                break;
            //right arrow
            case 40:
                plane.translateY(- increment)
                break;
            //numpad 6
            case 52:
                plane.rotateY(- increment)
                break;
            //numpad  4
            case 54:
                plane.rotateY( increment)
                break;

            //numpad  5
            case 53:
                plane.scale.set(16/3,9/3,0);
                break;

            //numpad  +
            case 107:
                plane.scale.set(plane.scale.x + increment,plane.scale.y ,0);
                break;

            //numpad  -
            case 109:
                plane.scale.set(plane.scale.x -increment,plane.scale.y ,0 );
                break;

            //numpad  +
            case 111:
                plane.scale.set(plane.scale.x ,plane.scale.y + increment,0);
                break;

            //numpad  -
            case 106:
                plane.scale.set(plane.scale.x ,plane.scale.y -increment ,0 );
                break;
            
            //left arrow
            case 55:
                plane.rotateZ( increment)
                break;
            //right arrow
            case 57:
                plane.rotateZ(- increment)
                break;


            //left arrow
            case 33:
                plane.translateZ(- increment)
                break;
            //right arrow
            case 34:
                plane.translateZ( increment)
                break;
            
            
        }

    });
}

function getDevices() {
// AFAICT in Safari this only gets default devices until gUM is called :/
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    let options = {};
    for (const deviceInfo of deviceInfos) {

        if (deviceInfo.kind === 'videoinput') {
            options[deviceInfo.label] = deviceInfo.deviceId;
        }
    }
    folder.add(data, 'options', options ).onChange(updateOptions);

}

function getStream(constraints) {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
        track.stop();
        });
    }

    
    
    return navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).catch(handleError);
}

function gotStream(mediaStream) {
    window.stream = mediaStream; // make stream available to console
    webcam.srcObject = mediaStream
        webcam.onloadedmetadata = function (e) {
            webcam.setAttribute('autoplay', 'true')
            webcam.setAttribute('playsinline', 'true')
            webcam.play()
        }

}

function handleError(error) {
    console.error('Error: ', error);
}

getDevices().then(gotDevices)
animate()
