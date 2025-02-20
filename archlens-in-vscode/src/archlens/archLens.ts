import { spawn } from 'child_process';
import { readFileAsJSON } from '../filesystem/fileoperations';

export async function getGraphJson(graphPath: string, archLensPath: string): Promise<string> {
    // Create a promise that resolves when the Python process completes
    /*await new Promise<void>((resolve, reject) => {
        const archLensProcess = spawn('python', [archLensPath, 'jsonfile']);
        
        archLensProcess.on('error', (error) => {
            reject(error);
        });

        archLensProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python process exited with code ${code}`));
            }
        });
    });*/

    const graphJson = await readFileAsJSON(graphPath);
    return graphJson;
}