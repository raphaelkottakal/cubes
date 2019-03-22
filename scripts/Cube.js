const Cube = function(mesh, velocity) {
  this.size = mesh.geometry.parameters.width;
  this.mesh = mesh;
  if (velocity) {
    this.velocity = velocity;
  } else {
    const x = mapNumber(Math.random(), 0, 1, -1, 1);
    const y = mapNumber(Math.random(), 0, 1, -1, 1);
    const z = 0;
    this.velocity = new THREE.Vector3(x, y, z);
  }
}

Cube.prototype.update = function(renderer) {
  this.mesh.position.add(this.velocity);
  const width = renderer.domElement.offsetWidth;
  const height = renderer.domElement.offsetHeight;
  this.checkScreenEdges(width, height);
}

Cube.prototype.checkScreenEdges = function(width, height) {
  if (width === 0) return;
  //Right
  if (this.mesh.position.x + this.mesh.geometry.parameters.width / 2 > width / 2) {
    this.mesh.position.x = width / 2 - this.mesh.geometry.parameters.width / 2;
    this.velocity.multiply(new THREE.Vector3(-1, 1, 1));
  } else if(this.mesh.position.x - this.mesh.geometry.parameters.width / 2 < - width / 2) {
    this.mesh.position.x = - width / 2 + this.mesh.geometry.parameters.width / 2;
    this.velocity.multiply(new THREE.Vector3(-1, 1, 1));
  } else if(this.mesh.position.y + this.mesh.geometry.parameters.height / 2 > height / 2) {
    this.mesh.position.y = height / 2 - this.mesh.geometry.parameters.width / 2;
    this.velocity.multiply(new THREE.Vector3(1, -1, 1));
  } else if(this.mesh.position.y - this.mesh.geometry.parameters.height / 2 < - height / 2) {
    this.mesh.position.y = - height / 2 + this.mesh.geometry.parameters.height / 2;
    this.velocity.multiply(new THREE.Vector3(1, -1, 1));
  }
}