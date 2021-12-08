#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const depcheck = require('depcheck');

const options = yargs
    .usage("Usage: -n <name>")
    .option("n", { alias: "number", describe: "number of libraries to check", type: "integer", demandOption: true })
    .argv;

const optionsDep = {};

(async () => {
    try {
        const { data } = await axios.get("http://localhost:8080/repositories?language=JavaScript", { headers: { 'Content-Type': 'application/json' } })

        let repos = []

        const packagesWithData = await Promise.all(data.slice(0, options.number).map(async (package) => {
            const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
            const { name } = package
            try {
                const { error, stdout, stderr } = await exec(`npm i -g ${kebabize(name)}`)
                if (stdout) {
                    const unused = await depcheck(`C:/Users/Eliav/AppData/Roaming/npm/node_modules/${kebabize(name)}`, optionsDep)
                    return {...package, 'unusedPackages' : unused.dependencies}
                }
            }
            catch (err) {
                return {...package, 'unusedPackages': 'failedToCheck'}
            }
        }))

        
        console.log(packagesWithData)
    }
    catch (ex) {

    }
})();