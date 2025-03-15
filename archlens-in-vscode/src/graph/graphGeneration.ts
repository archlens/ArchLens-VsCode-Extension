import * as json_interfaces from "./graphJson";
import { Graph } from "./graph";


export function buildGraph(json :string) : Graph {
    const graph : json_interfaces.Graph = JSON.parse(json);
    return new Graph(graph);
}