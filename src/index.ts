import path from 'path';
import { rm, stat, mkdir, writeFile } from 'fs/promises';
import { glob } from 'fast-glob';
import { task } from 'hardhat/config';

async function checkDir(fileOrDir: string): Promise<boolean> {
    try {
        await stat(fileOrDir);

        return true;
    } catch {
        return false;
    }
}

task('flatten:all', 'Flatten all contracts under flatten directory')
    .addParam('input', 'Contract src (default to contracts)', './contracts')
    .addParam('output', 'Directory to save flatten contracts (default to flatten)', './flatten')
    .setAction(async (taskArgs, hre) => {
        const { input, output } = taskArgs;
        const files = await glob([`${input}/**/*.sol`]);

        await rm(output, { recursive: true, force: true });

        for (const file of files) {
            const dest = file.replace(input, output);
            const dir = path.dirname(dest);

            if (!(await checkDir(dir))) {
                await mkdir(dir, { recursive: true });
            }

            try {
                const flatten = await hre.run('flatten:get-flattened-sources', { files: [file] });
                await writeFile(dest, flatten);
                console.log(`flatten:all: ${dest}`);
            } catch (e) {
                console.log(`flatten:all: error for ${dest} (likely circular)`);
                console.log(e);
            }
        }
    });
