const fs = require("fs");
const parseOBJ = require("parse-obj");

const infilename = process.argv.length > 2 && process.argv[2];
if (!infilename) {
    console.log("No file provided");
    process.exit();
}

const outfilename = process.argv.length > 3 && process.argv[3];

console.log(`Parsing file: ${infilename}`);
parseOBJ(fs.createReadStream(infilename), (err, result) => {
    if (err) { throw new Error(`Error parsing OBJ file: ${err}`); }
    if (outfilename) {
        console.log(`Writing to file ${outfilename}`);
        const data = `\
export const positions = ${JSON.stringify(result.vertexPositions)};
export const normals = ${JSON.stringify(result.vertexNormals)};
export const uvs = ${JSON.stringify(result.vertexUVs)};
`;
        fs.writeFile(outfilename, data, err => {
            if (err) { console.log(`Error writing to file ${err}`); }
            console.log("Done");
        });
    } else {
        console.log(`Got mesh: ${result}`);
    }
});
