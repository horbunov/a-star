interface IPoint {
  x: number;
  y: number;
}

class GridNode implements IPoint {
  public x: number;
  public y: number;
  public blocked: boolean;
  public parent?: GridNode;

  constructor(x: number, y: number, blocked: boolean) {
    this.x = x;
    this.y = y;
    this.blocked = blocked;
  }
}

class Grid<T extends GridNode = GridNode> extends Array<T[]> {
  constructor(gridList: string[], blockedChar = 'X') {
    super();
    this.init(gridList, blockedChar);
  }

  private init(gridList, blockedChar) {
    for (let i = 0; i < gridList.length; i++) {
      const rowText = gridList[i];
      const row: T[] = [];

      for (let j = 0; j < rowText.length; j++) {
        row.push(new GridNode(i, j, rowText[j] === blockedChar) as T);
      }

      this.push(row);
    }
  }

  public getDistance(from: IPoint, to: IPoint) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
  }
}

type AStarNode = GridNode & {
  g: number;
  h: number;
  f: number;
  parent: AStarNode;
};

export class AStar {
  public static BLOCKED_CHAR = 'X';

  private grid: Grid<AStarNode>;

  constructor(gridList: string[]) {
    this.grid = new Grid<AStarNode>(gridList);
  }

  public search(startX: number, startY: number, endX: number, endY: number) {
    const start = this.grid[startX][startY];
    const end = this.grid[endX][endY];

    if (end.blocked) {
      return [];
    }

    start.g = 0;
    start.h = this.grid.getDistance(start, end);
    start.f = start.h;

    const openedList = [start];
    const closedList: AStarNode[] = [];

    while (openedList.length > 0) {
      const currentNode = openedList.reduce((acc, item) =>
        acc.f < item.f ? acc : item,
      );

      if (currentNode.h === 0) {
        return this.getPath(currentNode);
      }

      openedList.splice(openedList.indexOf(currentNode), 1);
      closedList.push(currentNode);

      const neighborList = this.getNeighbors(currentNode);
      for (const neighbor of neighborList) {
        if (neighbor.blocked || closedList.includes(neighbor)) {
          continue;
        }

        const g = currentNode.g + 1;
        let gBest = false;

        if (!openedList.includes(neighbor)) {
          neighbor.h = this.grid.getDistance(neighbor, end);
          openedList.push(neighbor);
          gBest = true;
        } else if (g < neighbor.g) {
          gBest = true;
        }

        if (gBest) {
          neighbor.parent = currentNode;
          neighbor.g = g;
          neighbor.f = g + neighbor.h;
        }
      }
    }

    return [];
  }

  private getF(node: AStarNode) {
    return node.g + node.h;
  }

  private getNeighbors({ x, y }: IPoint) {
    const result: AStarNode[] = [];

    // Лево
    if (this.grid[x - 1]?.[y]) {
      result.push(this.grid[x - 1][y]);
    }

    // Право
    if (this.grid[x + 1]?.[y]) {
      result.push(this.grid[x + 1][y]);
    }

    // Низ
    if (this.grid[x]?.[y - 1]) {
      result.push(this.grid[x][y - 1]);
    }

    // Верх
    if (this.grid[x]?.[y + 1]) {
      result.push(this.grid[x][y + 1]);
    }

    // Лево верх
    if (this.grid[x - 1]?.[y - 1]) {
      result.push(this.grid[x - 1][y - 1]);
    }

    // Право верх
    if (this.grid[x + 1]?.[y - 1]) {
      result.push(this.grid[x + 1][y - 1]);
    }

    // Лево низ
    if (this.grid[x - 1]?.[y + 1]) {
      result.push(this.grid[x - 1][y + 1]);
    }

    // Право низ
    if (this.grid[x + 1]?.[y + 1]) {
      result.push(this.grid[x + 1][y + 1]);
    }

    return result;
  }

  private getPath(node: AStarNode) {
    let current = node;
    const result = [current];

    while (current.parent) {
      result.push(current.parent);
      current = current.parent;
    }

    return result.reverse();
  }
}

export function runner(
  gridList: string[],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  const path = new AStar(gridList).search(startX, startY, endX, endY);

  return path.map(({ x, y }) => ({ x, y }));
}
