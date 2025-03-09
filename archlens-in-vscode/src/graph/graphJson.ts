export interface File{
    name: string
    path: string
    edge_to: string[]
}

export interface Module{
    name: string
    full_name: string
    path: string
    files: Map <string, File>
}

export interface ModuleMap {
    src_dir: string
    modules: Map <string, Module>
}