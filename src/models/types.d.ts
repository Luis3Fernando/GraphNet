export interface Node {
    id: number,
    name: string,
    x: number,
    y: number,
}

export interface Arco {
    id: number,
    weight: number,
    from: Node,
    to: Node
}