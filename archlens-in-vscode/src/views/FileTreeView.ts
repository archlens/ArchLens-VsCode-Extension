import * as vscode from 'vscode';

class TreeDataProvider implements vscode.TreeDataProvider<string> {

    private data: Map<string, string[]>

    constructor(data: Map<string, string[]>){
        this.data = data;
    }

    getTreeItem(element: string): vscode.TreeItem {
        const hasChildren = this.data.has(element);
        return new vscode.TreeItem(
            element,
            hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );
    }

    getChildren(element?: string): string[] {
        if (!element) {
            return Array.from(this.data.keys());
        }
        return this.data.get(element) ?? [];
    }  
}


export function showTreeView(context: vscode.ExtensionContext, files : Map<string, string[]>) : void {
    const treeViewProvider = new TreeDataProvider(files);
    const treeView = vscode.window.createTreeView(
        'filesWithDependencyTree',
        {treeDataProvider: treeViewProvider},
    );

    context.subscriptions.push(treeView);
}