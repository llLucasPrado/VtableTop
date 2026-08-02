import { useEffect, useRef } from 'react';

const CANVAS_WIDTH = 128;
const CANVAS_HEIGHT = 144;
const ROLL_DURATION = 900;
const STAGGER = 34;
const CAMERA_DISTANCE = 4.2;
const PROJECTION_SCALE = 48;

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a, b) {
  return a.reduce(
    (total, value, index) => total + value * b[index],
    0,
  );
}

function normalize(vector) {
  const length = Math.hypot(...vector) || 1;
  return vector.map((value) => value / length);
}

function faceNormal(vertices, indices) {
  const firstEdge = subtract(vertices[indices[1]], vertices[indices[0]]);
  const secondEdge = subtract(vertices[indices[2]], vertices[indices[0]]);
  return normalize(cross(firstEdge, secondEdge));
}

function faceCenter(vertices, indices) {
  return indices
    .reduce(
      (center, vertexIndex) => {
        const vertex = vertices[vertexIndex];
        return [
          center[0] + vertex[0] / indices.length,
          center[1] + vertex[1] / indices.length,
          center[2] + vertex[2] / indices.length,
        ];
      },
      [0, 0, 0],
    );
}

function createD10Geometry() {
  const ringHeight = 0.1056;
  const vertices = Array.from({ length: 10 }, (_, index) => {
    const angle = (index * Math.PI) / 5;
    return [
      Math.cos(angle),
      Math.sin(angle),
      index % 2 === 0 ? ringHeight : -ringHeight,
    ];
  });

  const topIndex = vertices.push([0, 0, 1]) - 1;
  const bottomIndex = vertices.push([0, 0, -1]) - 1;
  const faces = [];

  for (let index = 0; index < 5; index += 1) {
    const even = index * 2;
    const odd = even + 1;
    const nextEven = (even + 2) % 10;
    const nextOdd = (odd + 2) % 10;

    faces.push([topIndex, even, odd, nextEven]);
    faces.push([bottomIndex, nextOdd, nextEven, odd]);
  }

  const outwardFaces = faces.map((indices, index) => {
    let orderedIndices = indices;
    let normal = faceNormal(vertices, orderedIndices);
    const center = faceCenter(vertices, orderedIndices);

    if (dot(normal, center) < 0) {
      orderedIndices = [...indices].reverse();
      normal = faceNormal(vertices, orderedIndices);
    }

    return {
      indices: orderedIndices,
      normal,
      value: index + 1,
    };
  });

  return { faces: outwardFaces, vertices };
}

const D10 = createD10Geometry();

function quaternionFromAxisAngle(axis, angle) {
  const halfAngle = angle / 2;
  const sine = Math.sin(halfAngle);
  return [
    axis[0] * sine,
    axis[1] * sine,
    axis[2] * sine,
    Math.cos(halfAngle),
  ];
}

function multiplyQuaternions(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

function quaternionFromUnitVectors(from, to) {
  const rotationAxis = cross(from, to);
  const rotation = [rotationAxis[0], rotationAxis[1], rotationAxis[2], 1 + dot(from, to)];
  const length = Math.hypot(...rotation) || 1;
  return rotation.map((value) => value / length);
}

function rotateVector(vector, quaternion) {
  const [qx, qy, qz, qw] = quaternion;
  const [vx, vy, vz] = vector;
  const ix = qw * vx + qy * vz - qz * vy;
  const iy = qw * vy + qz * vx - qx * vz;
  const iz = qw * vz + qx * vy - qy * vx;
  const iw = -qx * vx - qy * vy - qz * vz;

  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
}

function slerpQuaternions(from, to, amount) {
  let target = to;
  let cosine = dot(from, target);

  if (cosine < 0) {
    target = target.map((value) => -value);
    cosine = -cosine;
  }

  if (cosine > 0.9995) {
    return normalize(
      from.map((value, index) => value + amount * (target[index] - value)),
    );
  }

  const angle = Math.acos(Math.min(1, cosine));
  const sine = Math.sin(angle);
  const fromWeight = Math.sin((1 - amount) * angle) / sine;
  const targetWeight = Math.sin(amount * angle) / sine;

  return from.map(
    (value, index) => value * fromWeight + target[index] * targetWeight,
  );
}

function spinQuaternion(progress, direction, seed) {
  const xRotation = quaternionFromAxisAngle(
    [1, 0, 0],
    progress * Math.PI * (5.2 + seed * 0.08),
  );
  const yRotation = quaternionFromAxisAngle(
    [0, 1, 0],
    direction * progress * Math.PI * (7.1 + seed * 0.06),
  );
  const zRotation = quaternionFromAxisAngle(
    [0, 0, 1],
    direction * progress * Math.PI * 2.4,
  );

  return multiplyQuaternions(zRotation, multiplyQuaternions(yRotation, xRotation));
}

function targetQuaternion(value, index) {
  const face = D10.faces[value - 1];
  const faceToCamera = quaternionFromUnitVectors(face.normal, [0, 0, 1]);
  const finishingTurn = quaternionFromAxisAngle(
    [0, 0, 1],
    ((index % 5) - 2) * 0.08,
  );

  return multiplyQuaternions(finishingTurn, faceToCamera);
}

function easeOutQuint(value) {
  return 1 - (1 - value) ** 5;
}

function mixColor(base, lightAmount) {
  return base.map((channel) =>
    Math.round(Math.min(255, Math.max(0, channel * lightAmount))),
  );
}

function project(vertex) {
  const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - vertex[2]);
  return [
    CANVAS_WIDTH / 2 + vertex[0] * PROJECTION_SCALE * perspective,
    CANVAS_HEIGHT / 2 - vertex[1] * PROJECTION_SCALE * perspective,
  ];
}

function renderDie(context, quaternion, hunger, settled, resultValue) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const rotatedVertices = D10.vertices.map((vertex) =>
    rotateVector(vertex, quaternion),
  );
  const projectedVertices = rotatedVertices.map(project);
  const light = normalize([-0.35, 0.5, 1]);
  const baseColor = hunger ? [190, 24, 38] : [220, 220, 216];
  const edgeColor = hunger ? 'rgba(69, 10, 10, 0.92)' : 'rgba(64, 64, 64, 0.9)';

  const visibleFaces = D10.faces
    .map((face) => {
      const normal = rotateVector(face.normal, quaternion);
      const depth = face.indices.reduce(
        (total, vertexIndex) => total + rotatedVertices[vertexIndex][2],
        0,
      ) / face.indices.length;
      return { ...face, depth, normal };
    })
    .filter((face) => face.normal[2] > -0.08)
    .sort((a, b) => a.depth - b.depth);

  for (const face of visibleFaces) {
    const points = face.indices.map((vertexIndex) => projectedVertices[vertexIndex]);
    const brightness = 0.56 + Math.max(0, dot(face.normal, light)) * 0.62;
    const color = mixColor(baseColor, brightness);

    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => context.lineTo(x, y));
    context.closePath();
    context.fillStyle = `rgb(${color.join(',')})`;
    context.fill();
    context.strokeStyle = edgeColor;
    context.lineWidth = face.value === resultValue && settled ? 2.4 : 1.35;
    context.stroke();

    if (settled && face.normal[2] > 0.16) {
      const center3d = faceCenter(rotatedVertices, face.indices);
      const [centerX, centerY] = project(center3d);
      const isResult = face.value === resultValue;
      context.fillStyle = hunger ? '#ffffff' : '#090909';
      context.globalAlpha = isResult ? 1 : Math.min(0.72, face.normal[2]);
      context.font = `${isResult ? 800 : 700} ${isResult ? 25 : 13}px Georgia, serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(String(face.value), centerX, centerY);
      context.globalAlpha = 1;
    }
  }
}

function D10Die({ value, hunger = false, index, isRolling }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return undefined;
    }

    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const direction = index % 2 === 0 ? -1 : 1;
    const target = targetQuaternion(value, index);

    if (reducedMotion) {
      renderDie(context, target, hunger, true, value);
      return undefined;
    }

    const delay = (index % 9) * STAGGER;
    const transitionPoint = 0.72;
    const transitionStart = spinQuaternion(transitionPoint, direction, index);
    const startTime = performance.now() + delay;
    let animationFrame;

    function animate(time) {
      const progress = Math.min(1, Math.max(0, (time - startTime) / ROLL_DURATION));
      let rotation;

      if (progress < transitionPoint) {
        rotation = spinQuaternion(progress, direction, index);
      } else {
        const landingProgress = easeOutQuint(
          (progress - transitionPoint) / (1 - transitionPoint),
        );
        rotation = slerpQuaternions(transitionStart, target, landingProgress);
      }

      renderDie(context, rotation, hunger, progress === 1, value);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [hunger, index, value]);

  return (
    <div
      className={`dice-cast ${isRolling ? 'dice-cast--rolling' : ''}`}
      style={{ '--die-delay': `${(index % 9) * STAGGER}ms` }}
    >
      <canvas
        ref={canvasRef}
        className="d10-canvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        role="img"
        aria-label={`${hunger ? 'Dado de Fome' : 'Dado comum'}: ${value}`}
      />
      <span className="dice-floor-shadow" aria-hidden="true" />
    </div>
  );
}

export default D10Die;
