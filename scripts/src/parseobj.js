const fs = require("fs");
const THREE = require("three");

// Not all of THREE is modular, it requires to have a global namespace present
global.THREE = THREE;

// This enriches the global THREE with OBJLoader
require("three/examples/js/loaders/OBJLoader");

const loader = new THREE.OBJLoader();
const keys = ["position", "normal", "uv"];
const roundNumber = (num, base) => {
    const pow = Math.pow(10, base);
    return Math.round( num * pow ) / pow;
};

const infilename = process.argv.length > 2 && process.argv[2];
if (!infilename) {
    console.log("USAGE: node parseobj.js path/to/infile [path/to/outfile]");
    process.exit();
}

const outfilename = process.argv.length > 3 && process.argv[3];

console.log(`Parsing file: ${infilename}`);
const contents = fs.readFileSync(infilename);
const obj = loader.parse(contents.toString());

const data = obj.children.map((child) => {
    const attrs = child.geometry.attributes;
    const res = {};
    keys.map((key) => {
        const { array, itemSize, count } = attrs[key];
        if (itemSize * count !== array.length) {
            console.log("size * count NE length");
            process.exit();
        }

        const arr = [];
        for (let i = 0; i < array.length; i += itemSize) {
            const item = [...array.slice(i, i + itemSize)];
            arr.push(item.map((n) => roundNumber(n, 4)));
        }

        res[key + "s"] = arr;
    });

    return res;
});

const text = `export const objects = ${JSON.stringify(data)};`;
if (outfilename) {
    console.log(`Writing to file ${outfilename}`);
    fs.writeFile(outfilename, text, err => {
        if (err) { console.log(`Error writing to file ${err}`); }
        console.log("Done");
    });
} else {
    console.log(text);
}
