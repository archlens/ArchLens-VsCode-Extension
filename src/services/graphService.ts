import type { ExtensionContext } from "vscode";
import { Graph } from "#app/graph/graph";
import * as graph_util from "#app/graph/graphGeneration";
import * as archLens from '#app/archlens/archLens';
import * as filesystem from "#app/filesystem/fileoperations";
import * as path from '#app/filesystem/pathResolver';

export class GraphService {

    private context : ExtensionContext

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    public async getGraph(viewName: string, diffView: boolean, reload: boolean = false) : Promise<Graph> {
        const config = await this.getConfig();
        const project = config.name;
        const saveLocation = config.saveLocation ?? "./diagrams";
        
        const graphJsonPath = path.GraphJson(viewName, diffView, project, saveLocation);
        const graphJson = await archLens.getGraphJson(graphJsonPath, this.context.extensionUri, diffView, reload);

        return graph_util.buildGraph(graphJson);
    }

    public async getViews() {
        const config = await this.getConfig();
        const viewsMap = config.views;
        const views: Array<string> = []
    
        // projectname-viewname.json
        for(let [viewName, view] of Object.entries(viewsMap)) {
            views.push(viewName);
        }

        return views;
    }

    private async getConfig(): Promise<any> {
        return JSON.parse(await filesystem.readJSON(path.ArchLensConfig));
    }
}