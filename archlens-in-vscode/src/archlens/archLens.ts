import { spawn } from 'child_process';
import { readFileAsJSON } from '../filesystem/fileoperations';

export async function getGraphJson(graphPath: string, archLensPath: string): Promise<string> {

    const graphJson = await readFileAsJSON(graphPath);
    return graphJson;
}