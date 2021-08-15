interface IPoint {
  x: number;
  y: number;
}

/** Узел сетки для алгоритма A* */
class GridNode implements IPoint {
  public x: number;
  public y: number;
  public blocked: boolean;
  public parent?: GridNode;
  /** Стоимость пути к узлу */
  public g: number;
  /** Расстояние к финишу */
  public h: number;

  constructor(x: number, y: number, blocked: boolean) {
    this.x = x;
    this.y = y;
    this.blocked = blocked;
    this.g = 0;
    this.h = -1;
  }

  /** Счет (g + h) */
  public get f() {
    return this.g + this.h;
  }
}

export class AStar {
  public static BLOCKED_CHAR = 'X';

  private grid: GridNode[][];

  constructor(gridList: string[]) {
    this.initGrid(gridList);
  }

  public search(startX: number, startY: number, endX: number, endY: number) {
    const start = this.grid[startX][startY];
    const end = this.grid[endX][endY];

    if (end.blocked) {
      return [];
    }

    start.h = this.calcH(start, end);

    const openedList = [start];
    const closedList: GridNode[] = [];

    while (openedList.length > 0) {
      const currentNode = openedList.reduce(
        (acc, item) => (acc.f < item.f ? acc : item),
        openedList[0],
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
          neighbor.h = this.calcH(neighbor, end);
          openedList.push(neighbor);
          gBest = true;
        } else if (g < neighbor.g) {
          gBest = true;
        }

        if (gBest) {
          neighbor.parent = currentNode;
          neighbor.g = g;
        }
      }
    }

    return [];
  }

  private initGrid(gridList: string[]) {
    const grid: GridNode[][] = [];

    for (let i = 0; i < gridList.length; i++) {
      const rowText = gridList[i];
      const row: GridNode[] = [];

      for (let j = 0; j < rowText.length; j++) {
        row.push(new GridNode(i, j, rowText[j] === AStar.BLOCKED_CHAR));
      }

      grid.push(row);
    }

    this.grid = grid;
  }

  private calcH(from: IPoint, to: IPoint) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
  }

  private getNeighbors({ x, y }: IPoint): GridNode[] {
    const result: GridNode[] = [];

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

  private getPath(node: GridNode) {
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
