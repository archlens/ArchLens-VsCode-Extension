import * as vscode from 'vscode';
import { Edge } from '../graph/graph';
import { File, Relation } from '../graph/graphJson'

class TreeDataProvider implements vscode.TreeDataProvider<File> {

    private files: Map<File, File[]>

    constructor(edge : Edge){
        this.files = new Map();
        let uniqueFiles = new Map<string, File>();

        for (let relation of edge.relations) {
            if (!uniqueFiles.has(relation.from_file.path)) {
                uniqueFiles.set(relation.from_file.path, relation.from_file)
                this.files.set(relation.from_file, []);
            } 
            this.files.get(uniqueFiles.get(relation.from_file.path)!)!.push(relation.to_file);
        }
    }

    getTreeItem(element: File): vscode.TreeItem {
        const hasChildren = this.files.has(element);
        let treeItem =  new vscode.TreeItem(
            element.name,
            hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );

        treeItem.command = {
            command: 'archlens-in-vscode.openFile',
            title: 'Open File',
            arguments: [element]
        };

        return treeItem;
    }

    getChildren(file?: File): File[] {
        if (!file) {
            return Array.from(this.files.keys());
        }
        return this.files.get(file)?.map((f) => {return f}) ?? [];
    }  
}


export function showTreeView(context: vscode.ExtensionContext, edge : Edge) : void {
    const treeViewProvider = new TreeDataProvider(edge);
    const treeView = vscode.window.createTreeView(
        'filesWithDependencyTree',
        {treeDataProvider: treeViewProvider},
    );

    context.subscriptions.push(treeView);
}