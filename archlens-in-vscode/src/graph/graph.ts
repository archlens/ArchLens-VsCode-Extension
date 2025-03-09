

export class Graph {

    private modules : Map<string, GraphModule> = new Map<string, GraphModule>();
    private files : Map<string, GraphFile> = new Map<string, GraphFile>();

    constructor() {
    }

    getModules() {
        return this.modules;
    }

    getModule(name : string) : GraphModule | undefined {
        return this.modules.get(name);
    }

    setModule(module : GraphModule) : void {
        this.modules.set(module.fullName, module);
    }

    getFile(name : string) : GraphFile | undefined {
        return this.files.get(name);
    }

    setFile(file : GraphFile) : void {
        this.files.set(file.path, file);
    }

    getFilenamesFromEdge(source : string, target : string) : Map<string, string[]>{
        let source_module = this.getModule(source)!;
        let target_module = this.getModule(target)!;

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
}

export class GraphFile {

    public edge_to : Set<GraphFile> = new Set<GraphFile>

    constructor (
        public name : string,
        public path : string,
        public module : GraphModule
    ) {}
}

export class GraphModule {

    public files : Set<GraphFile> = new Set<GraphFile>();

    constructor (
        public name : string,
        public fullName : string,
        public path : string,
    ) {}
}