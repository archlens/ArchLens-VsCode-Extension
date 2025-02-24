import { spawn } from 'child_process';
import * as file from '../filesystem/fileoperations';
import * as vs from 'vscode';

export async function getGraphJson(graphPath: vs.Uri, archLensPath: vs.Uri): Promise<string> {

    const graphJson = await file.readJSON(graphPath);
    return graphJson;
}