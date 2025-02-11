type Edge = [number, number, number];

type StepMatrix = number[][];

class DisjointSet {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(u: number): number {
    if (this.parent[u] !== u) {
      this.parent[u] = this.find(this.parent[u]);
    }
    return this.parent[u];
  }

  union(u: number, v: number): void {
    let rootU = this.find(u);
    let rootV = this.find(v);

    if (rootU !== rootV) {
      if (this.rank[rootU] > this.rank[rootV]) {
        this.parent[rootV] = rootU;
      } else if (this.rank[rootU] < this.rank[rootV]) {
        this.parent[rootU] = rootV;
      } else {
        this.parent[rootV] = rootU;
        this.rank[rootU]++;
      }
    }
  }
}

function convertMatrixToEdges(matrix: number[][]): Edge[] {
  const edges: Edge[] = [];
  const size = matrix.length;

  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) { // Asegura que no se dupliquen los bordes
      if (matrix[i][j] !== 0) {
        edges.push([i, j, matrix[i][j]]);
      }
    }
  }

  return edges;
}

export function kruskal(n: number, matrix: number[][]): StepMatrix {
  const edges = convertMatrixToEdges(matrix);
  edges.sort((a, b) => a[2] - b[2]); // Ordenar por peso
  const dsu = new DisjointSet(n);
  const mst: Edge[] = [];
  const finalMatrix: StepMatrix = Array.from({ length: n }, () => new Array(n).fill(0));

  for (const [u, v, weight] of edges) {
    if (dsu.find(u) !== dsu.find(v)) {
      dsu.union(u, v);
      mst.push([u, v, weight]);
    }
  }

  for (const [u, v, weight] of mst) {
    finalMatrix[u][v] = weight;
    finalMatrix[v][u] = weight;
  }

  return finalMatrix;
}