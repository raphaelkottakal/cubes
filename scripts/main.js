// global constants
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 5000 );
const renderer = new THREE.WebGLRenderer();
const gui = new dat.GUI();
const guiValues = new makeGuiValues();
const stats = new Stats();

// create elements
const camControls = new THREE.OrbitControls( camera );
const ambientLight = new THREE.AmbientLight( 0x404040 );
const light1 = new THREE.DirectionalLight(0xffffff, 0.47);
const light2 = new THREE.DirectionalLight(0xffffff, 0.28);

const theSpace = new CubeSpace(scene, renderer);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// config
stats.showPanel(0);
gui.close();
gui.add(guiValues, 'orbitCam');
theSpace.createCube(window.innerWidth * 0.3, new THREE.Vector3(0, 0, 0));
// theSpace.createCube(200, new THREE.Vector3(-150, 0, 0));
// theSpace.createCube(200, new THREE.Vector3(150, 0, 0));
// camera
camControls.enableDamping = true;
camControls.enabled = false;
camera.position.z = 1000;
// light
light1.position.x = 160;
light1.position.y = 0;
light1.position.z = 160;
light1.lookAt(scene.position);

light2.position.x = -160;
light2.position.y = 0;
light2.position.z = 160;
light2.lookAt(scene.position);
// const helper1 = new THREE.DirectionalLightHelper( light1, 50 );
// const helper2 = new THREE.DirectionalLightHelper( light2, 50 );
// renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// add lighting



scene.add(light1);
scene.add(light2);
// scene.add( helper1 );
// scene.add( helper2 );
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
  this.orbitCam = true;
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
  console.log('Number of cubes', theSpace.space.length);
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( scene.children );
  if (intersects[0]) theSpace.explodeCube(intersects[0].object);
  // for ( var i = 0; i < intersects.length; i++ ) {
  // }
}