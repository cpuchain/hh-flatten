"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const fast_glob_1 = require("fast-glob");
const config_1 = require("hardhat/config");
async function checkDir(fileOrDir) {
    try {
        await (0, promises_1.stat)(fileOrDir);
        return true;
    }
    catch {
        return false;
    }
}
(0, config_1.task)('flatten:all', 'Flatten all contracts under flatten directory')
    .addParam('input', 'Contract src (default to contracts)', './contracts')
    .addParam('output', 'Directory to save flatten contracts (default to flatten)', './flatten')
    .setAction(async (taskArgs, hre) => {
    const { input, output } = taskArgs;
    const files = await (0, fast_glob_1.glob)([`${input}/**/*.sol`]);
    await (0, promises_1.rm)(output, { recursive: true, force: true });
    for (const file of files) {
        const dest = file.replace(input, output);
        const dir = path_1.default.dirname(dest);
        if (!(await checkDir(dir))) {
            await (0, promises_1.mkdir)(dir, { recursive: true });
        }
        try {
            const flatten = await hre.run('flatten:get-flattened-sources', { files: [file] });
            await (0, promises_1.writeFile)(dest, flatten);
            console.log(`flatten:all: ${dest}`);
        }
        catch (e) {
            console.log(`flatten:all: error for ${dest} (likely circular)`);
            console.log(e);
        }
    }
});
