// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebviewHTMLTemplate } from './views/webviewHTMLTemplate';
import * as graph_util from "./graph/graphGeneration";
import { showTreeView } from './views/FileTreeView';
import * as archlens from './archlens/archLens';
import * as path from './filesystem/pathResolver';
import {Graph} from "./graph/graph";
import * as filesystem from "./filesystem/fileoperations";
import { File } from "./graph/graphJson"
import * as setup from './archlens/setupArchlens';
import { WebviewService } from './webview/webviewService';
import { GraphService } from './services/graphService';

export function activate(context: vscode.ExtensionContext) {

    const webviewService = new WebviewService(context);
    const graphService = new GraphService(context);

    context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.openFile', (file: File) => {
            const uri = vscode.Uri.file(file.path);
            vscode.window.showTextDocument(uri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.setupArchLens', async () => {
            let venv = await setup.checkVenv();
            if (!venv) return;
            let interpreter = await setup.getInterpreter();
            const archlens = await setup.checkArchlens(interpreter);
            if (!archlens) return;
            let config = await setup.checkArchlensConfig();
            if (!config) return;
            vscode.window.showInformationMessage("Archlens setup complete!")
        }
    ));

	context.subscriptions.push(
        vscode.commands.registerCommand('archlens-in-vscode.openGraphView', async () => {
            
            const panel = webviewService.createWebView();

            let g : Graph | undefined = undefined;
            let view = "";
            let diffView = false;

            webviewService.registerMessageHandler('edge_clicked', async (message) => {
                const edge = g!.getEdgeFromID(message.edgeID);
                showTreeView(context, edge!);
            });

            webviewService.registerMessageHandler('get_view', async (message) => {
                view = message.view;
                diffView = message.diffView;

                g = await updateGraph(view, webviewService, graphService, diffView, message.reload);
            });

            webviewService.registerMessageHandler('get_views', async (message) => {
                await getViews(webviewService, graphService);
            });
            
            let saveEventHandler = vscode.workspace.onDidSaveTextDocument(async (_) => {
                g = await updateGraph(view, webviewService, graphService, diffView, true);
            });

            let deleteFileEventHandler = vscode.workspace.onDidDeleteFiles(async (_) => {
                g = await updateGraph(view,webviewService, graphService, diffView, true);
            });
          
            context.subscriptions.push(saveEventHandler, deleteFileEventHandler);

            panel.onDidDispose(() => {
                saveEventHandler.dispose();
                deleteFileEventHandler.dispose();
            });
        })
    );
}



async function getViews(webviewService: WebviewService, graphService: GraphService): Promise<void> {
    const views = await graphService.getViews();

    webviewService.sendMessage({ command: "update_views",
        views: views 
    })
}

async function updateGraph(
    view: string, 
    webviewService: WebviewService, 
    graphService: GraphService,
    diffView = false, 
    reload: boolean = false
): Promise<Graph> {
    webviewService.sendMessage({ command: "updating_graph" });
    
    const graph = await graphService.getGraph(view, diffView, reload);

    webviewService.sendMessage({ 
        command: "update_graph",
        graph: graph.toList(),
    });

    webviewService.sendMessage({ command: "graph_updated" });

    return graph;
}

export function deactivate() {}
