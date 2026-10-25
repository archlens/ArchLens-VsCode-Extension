import * as json_interfaces from "#app/graph/graphJson";
import { Graph } from "#app/graph/graph";


export function buildGraph(json :string) : Graph {
    const graph : json_interfaces.Graph = JSON.parse(json);
    return new Graph(graph);
}