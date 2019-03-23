const Cube = function(mesh, velocity) {
  this.size = mesh.geometry.parameters.width;
  this.mesh = mesh;
  if (velocity) {
    this.velocity = velocity;
  } else {
    const x = mapNumber(Math.random(), 0, 1, -1, 1);
    const y = mapNumber(Math.random(), 0, 1, -1, 1);
    const z = mapNumber(Math.random(), 0, 1, -1, 1);
    this.velocity = new THREE.Vector3(x, y, z);
  }
}

Cube.prototype.update = function(renderer) {
  this.mesh.position.add(this.velocity);
  const width = renderer.domElement.offsetWidth;
  const height = renderer.domElement.offsetHeight;
  const depth = 1000;
  this.checkScreenEdges(width, height, depth);
}

Cube.prototype.checkScreenEdges = function(width, height, depth) {
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
  } else if(this.mesh.position.z + this.mesh.geometry.parameters.depth / 2 > depth / 2) {
    this.mesh.position.z = depth / 2 - this.mesh.geometry.parameters.depth / 2;
    this.velocity.multiply(new THREE.Vector3(1, 1, -1));
  } else if(this.mesh.position.z - this.mesh.geometry.parameters.depth / 2 < - depth / 2) {
    this.mesh.position.z = - depth / 2 + this.mesh.geometry.parameters.depth / 2;
    this.velocity.multiply(new THREE.Vector3(1, 1, -1));
  }
}

Cube.prototype.checkCollision = function(allCubes) {
  let cubeIndex;
  const mesh = this.mesh;
  for (let i = 0; i < allCubes.length; i++) {
    const cube = allCubes[i];
    if (cube.mesh === this.mesh) {
      // console.log('Its meee');
      cubeIndex = i;
      break;
    } else {
      // console.log('Not me');
    }
  }
  const allOtherCubes = allCubes.slice();
  allOtherCubes.splice(cubeIndex, 1);
  const allOtherCubeMeshes = allOtherCubes.map(function(cube) {
    return cube.mesh;
  });
  // console.log(allCubes, allOtherCubes);
  for (let i = 0; i < this.mesh.geometry.vertices.length; i++) {
    const localVertex = this.mesh.geometry.vertices[i].clone();
    const globalVertex = localVertex.clone().applyMatrix4(this.mesh.matrix);
    const directionVector = globalVertex.sub( this.mesh.position );

    const ray = new THREE.Raycaster( this.mesh.position, directionVector.clone().normalize() );
    const collisionResults = ray.intersectObjects( allOtherCubeMeshes );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
    {
        collisionResults.forEach(function(item) {
          console.log(mesh.id, item.object.id);
        });
      // console.log(collisionResults, collisionResults[0].distance, directionVector.length());
      // a collision occurred... do something...
      console.log('That\'s a hit');
    }
    
  }
}