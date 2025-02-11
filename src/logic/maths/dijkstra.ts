export function dijkstra(n: number, matrix: number[][], start: number, end: number): number[] {
  const distances = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  const previous = new Array(n).fill(-1);
  distances[start] = 0;

  for (let i = 0; i < n - 1; i++) {
    const u = minDistance(distances, visited);
    visited[u] = true;

    for (let v = 0; v < n; v++) {
      if (!visited[v] && matrix[u][v] !== 0 && distances[u] !== Infinity && distances[u] + matrix[u][v] < distances[v]) {
        distances[v] = distances[u] + matrix[u][v];
        previous[v] = u;
      }
    }
  }

  return constructPath(previous, start, end);
}

function minDistance(distances: number[], visited: boolean[]): number {
  let min = Infinity;
  let minIndex = -1;

  for (let v = 0; v < distances.length; v++) {
    if (!visited[v] && distances[v] < min) {
      min = distances[v];
      minIndex = v;
    }
  }

  return minIndex;
}

function constructPath(previous: number[], start: number, end: number): number[] {
  const path = [];
  for (let at = end; at !== -1; at = previous[at]) {
    path.push(at);
  }
  path.reverse();
  return path[0] === start ? path : [];
}