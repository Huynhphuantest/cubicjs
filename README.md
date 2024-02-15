# NOTE: CubicJS is still in development, the offical version will be published with version 1.0.0

# CubicJS
## What is CubicJS?
CubicJS is a lightweight, user-friendly, fast and reliable physic libary for javascripts.
## How to use CubicJS?
Every function in CubicJS will be documented.

This code will create a static platform and a Sphere on it.
```javascript
import * as CUBIC from 'cubic';

const world = new CUBIC.World({ gravity: new CUBIC.Vector3(0,-0.5,0) });

const sphereShape = new CUBIC.Sphere( 5 );

const sphereBody = new CUBIC.Body(
  shapes: sphereShape, // You could implement many shape into one body,
  mass: 5
);
world.add(sphereBody);


const groundShape = new CUBIC.Box( 50, 5, 50 );

const groundBody = new CUBIC.Body(
  shapes: groundShape,
  mass: 0 // Or `type: CUBIC.Body.STATIC`
);
world.add(groundBody);

// Update world on every frame, you could use  `setInterval` with fixed delta time
function update(deltaTime) {
  world.step(deltaTime);

  requestAnimationFrame(update);
}
requestAnimationFrame(update);
```
