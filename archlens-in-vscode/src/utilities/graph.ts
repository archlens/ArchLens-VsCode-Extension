interface File{
    name: string
    path: string
    edge_to: string[]
}

interface Module{
    name: string
    full_name: string
    path: string
    files: Map <string, File>
}      

interface Graph {
    src_dir: string
    modules: Map <string, Module>
}

class GraphFile {
    constructor (
        public name : string,
        public path : string,
        public edge_to : Set<GraphFile>,
        public module : GraphModule
    ) {}
}

class GraphModule {
    constructor (
        public name : string,
        public fullName : string,
        public path : string,
        public files : Set<GraphFile>
    ) {}
}

export function buildGraph(json :string) : Map<string,GraphModule>{
    const graph : Graph = JSON.parse(json);
    let modules = new Map<string, Module>(Object.entries(graph.modules));

    let parsedModules = new Map<string, GraphModule>();
    let parsedFiles = new Map<string, GraphFile>();

    for (let m of modules.values()) {
        let parsedModule = new GraphModule (m.name, m.full_name, m.path, new Set);
        let files = new Map <string, File>(Object.entries(m.files));
        for (let f of files.values()) {
            let parsedFile = new GraphFile(f.name, f.path, new Set, parsedModule);
            parsedModule.files.add(parsedFile);
            parsedFiles.set(f.path, parsedFile);
        }
        parsedModules.set(m.full_name, parsedModule);
    }

    for (let m of modules.values()) {
        let files = new Map <string, File>(Object.entries(m.files))
        for (let f of files.values()) {
            for (let edge of f.edge_to) {
                parsedFiles.get(f.path)!.edge_to.add(parsedFiles.get(edge)!)
            }
        }
    }

    return parsedModules;
}

export function makeElementsList(g : Map<string,GraphModule>){
    let elements = Array.from(g.entries()).map<object>((m, i, elements) => { return { data: { id: m[1].fullName, label: m[1].fullName, type: 'Module' }}});

    let edges = new Map;

    for(let m of g.entries()) {
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

export function getFilenamesFromEdge(g : Map<string, GraphModule>, source : string, target : string) : Map<string, string[]>{
    let source_module = g.get(source)!;
    let target_module = g.get(target)!;

    let files = new Map<string, string[]>();

    for (let f of source_module.files){
        let lst = [];
        
        for (let edge of f.edge_to){
            if (target_module.files.has(edge)) {
                lst.push(edge.name);
            }
        }

        if(lst.length != 0) {
            files.set(f.name, lst);
        }
    }

    return files;
}