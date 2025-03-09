import { ModuleMap, File, Module } from "./graphJson";
import { Graph, GraphModule, GraphFile} from './graph';


export function buildGraph(json :string) : Graph {
    const moduleMap : ModuleMap = JSON.parse(json);
    const graph = new Graph();

    for (let [name, module] of Object.entries(moduleMap.modules)) {
        let parsedModule = new GraphModule (module.name, module.full_name, module.path);

        for (let [fileName, file] of Object.entries(module.files as Record<string, File>)) {
            let parsedFile = new GraphFile(file.name, file.path, parsedModule);

            parsedModule.files.add(parsedFile);
            graph.setFile(parsedFile);
        }

        graph.setModule(parsedModule);
    }

    for (let [name, module] of Object.entries(moduleMap.modules)) {
        for (let [fileName, file] of Object.entries(module.files as Record<string, File>)) {
            for (let edge of file.edge_to) {
                graph.getFile(file.path)!.edge_to.add(graph.getFile(edge)!)
            }
        }
    }

    return graph;
}

export function makeElementsList(g : Graph){
    let elements = Array.from(g.getModules()).map<object>((m, i, elements) => { return { data: { id: m[1].fullName, label: m[1].fullName, type: 'Module' }}});

    let edges = new Map;

    for(let m of g.getModules()) {
        for (let from of m[1].files){
            for( let to of from.edge_to){
                if (from.module != to.module){
                    let data = null;
                    if(edges.has(from.module!.fullName+to.module!.fullName)){
                        data = edges.get(from.module!.fullName+to.module!.fullName);
                        data.data.label++;
                    } else {
                        data = { data: {id: (from.module!.fullName+to.module!.fullName), source: m[1].fullName, target: to.module!.fullName, label:1}};
                    }
                    edges.set(from.module!.fullName+to.module!.fullName, data);
                }
            }
        }
    }

    for (let [key, data] of edges){
        elements.push(data);
    }

    return elements;
}