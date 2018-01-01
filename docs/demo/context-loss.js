import { Device, VertexBuffer } from "./lib/glutenfree.production.es.min.js";

const canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(document.createElement("canvas"));

const dev = Device.fromCanvas(canvas);
const gl = dev.gl;

canvas.setRestoreTimeout(-1);
canvas.addEventListener("webglcontextlost", ev => {
    console.log("LOST");

    console.log(gl.isContextLost());
    console.log(gl.FLOAT);
    console.log(buf.glBuffer);
    console.log(gl.isBuffer(buf.glBuffer));

    ev.preventDefault();
});
canvas.addEventListener("webglcontextrestored", () => {
    console.log("RESTORED");

    buf.restore();

    console.log(gl.isContextLost());
    console.log(gl.FLOAT);
    console.log(buf.glBuffer);
    console.log(gl.isBuffer(buf.glBuffer));
})

const buf = VertexBuffer.create(gl, {
    type: "float",
    data: [1, 2, 3, 4],
});

console.log(gl.isContextLost());
console.log(gl.FLOAT);
console.log(buf.glBuffer);
console.log(gl.isBuffer(buf.glBuffer));

canvas.loseContext();
canvas.restoreContext();



