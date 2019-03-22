const CubeSpace = function(scene, renderer) {
  this.space = [];
  this.scene = scene;
  this.renderer = renderer;
}

CubeSpace.prototype.createCube = function(size, position, velocity) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 'hsl(' + mapNumber(Math.random(), 0, 1, 0, 360) + ', 100%, 70%)',
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.add(position);
  const cube = new Cube(mesh, velocity);
  this.space.push(cube);
  this.scene.add(mesh);
}

CubeSpace.prototype.updateSpace = function() {
  for (let i = this.space.length - 1; i >= 0; i--) {
    const cube = this.space[i];
    cube.update(this.renderer);
  }
}

CubeSpace.prototype.getMatchingIndex = function(mesh) {
  for (let i = 0; i < this.space.length; i++) {
    const cube = this.space[i];
    if (cube.mesh === mesh) {
      return i;
    }
  }
}

CubeSpace.prototype.explodeCube = function(mesh) {
  const cubeIndex = this.getMatchingIndex(mesh);
  const cube = this.space[cubeIndex];
  const position = cube.mesh.position;
  //Remove parent cube
  this.scene.remove(cube.mesh);
  cube.mesh.geometry.dispose();
  cube.mesh.material.dispose();
  this.space.splice(cubeIndex, 1);
  const childCubePositions = this.getBreakPoints(position, cube.size);
  const childCubeVelocities = this.getVelocityAdded();
  for (let i = 0; i < childCubePositions.length; i++) {
    // this.createCube(cube.size / 2, childCubePositions[i], childCubeVelocities[i]);
    this.createCube(cube.size / 2, childCubePositions[i], cube.velocity.clone().add(childCubeVelocities[i]));
  }
}

CubeSpace.prototype.getBreakPoints = function(position, size) {
  const points = [];
  points.push(position.clone().add(new THREE.Vector3(size / 4, size / 4, 0)));
  points.push(position.clone().add(new THREE.Vector3(- size / 4, size / 4, 0)));
  points.push(position.clone().add(new THREE.Vector3(size / 4, - size / 4, 0)));
  points.push(position.clone().add(new THREE.Vector3(- size / 4, - size / 4, 0)));
  return points;
}

CubeSpace.prototype.getVelocityAdded = function() {
  const velocities = [];
  velocities.push(new THREE.Vector3(1, 1, 0).normalize());
  velocities.push(new THREE.Vector3(-1, 1, 0).normalize());
  velocities.push(new THREE.Vector3(1, -1, 0).normalize());
  velocities.push(new THREE.Vector3(-1, -1, 0).normalize());
  velocities.forEach(function(velocity) {
    velocity.multiplyScalar(0.1);
  });
  return velocities;
}

CubeSpace.prototype.explodeCubes = function(cubes) {
  for (let i = 0; i < cubes.length; i++) {
    const cube = this.space[i];
    this.explodeCube(cube.mesh);
  }
}