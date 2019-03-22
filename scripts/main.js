// global constants
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 5000 );
const renderer = new THREE.WebGLRenderer();
const gui = new dat.GUI();
const guiValues = new makeGuiValues();
const stats = new Stats();

// create elements
const camControls = new THREE.OrbitControls( camera );
const ambientLight = new THREE.AmbientLight( 0x404040 );
const light = new THREE.DirectionalLight(0xffffff, 0.75);
const theSpace = new CubeSpace(scene, renderer);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// config
stats.showPanel(0);
gui.close();
gui.add(guiValues, 'orbitCam');
theSpace.createCube(window.innerWidth * 0.4, new THREE.Vector3(0, 0, 0));
// theSpace.createCube(200, new THREE.Vector3(-150, 0, 0));
// theSpace.createCube(200, new THREE.Vector3(150, 0, 0));
// camera
camControls.enableDamping = true;
camControls.enabled = false;
camera.position.z = 1000;
// light
light.position.x = 16;
light.position.y = 16;
light.position.z = 16;
// renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// add lighting
scene.add(light);
scene.add(ambientLight);

// animation
function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  setFromGui();
  theSpace.updateSpace();
  camControls.update();
  stats.end();
	renderer.render(scene, camera);
}


function setFromGui() {
  if (camControls.enabled !== guiValues.orbitCam) {
    camControls.enabled = guiValues.orbitCam;
  }
}

animate();

// add renderer to dom
document.body.appendChild( stats.dom );
document.body.appendChild(renderer.domElement);
window.onresize = onResize;
renderer.domElement.addEventListener('click', onTapSpace);

// gui functions 
function makeGuiValues() {
  this.orbitCam = false;
};

// other functions
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.left = -window.innerWidth / 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = -window.innerHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove() {
  console.log('Tapped');
}

function onTapSpace(event) {
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( scene.children );
  for ( var i = 0; i < intersects.length; i++ ) {
    theSpace.explodeCube(intersects[i].object);
  }
}