/**
Problem Statement:

You are given a square board with cells that can be either empty, or occupied by a stone of one of three colors - black or white. You need to find the number of liberties (adjacent empty cells) for each group of stones of the same color.

A group of stones is defined as a set of stones of the same color that are adjacent to each other vertically or horizontally. A liberty is defined as an empty cell that is adjacent to a stone of the same color.

For example, consider the following board:
[
 [ 0, 0, 0, 0, 0 ],
 [ 0, 1, 1, 0, 0 ],
 [ 0, 1,-1, 1, 0 ],
 [ 0, 1, 1, 0, 0 ],
 [ 0, 0, 0, 0, -1]
]

this is the board representing the liberties for White (stones of type 1)
[
 [ 0, 0, 0, 0, 0 ],
 [ 0, 2, 2, 0, 0 ],
 [ 0, 1, 0, 3, 0 ],
 [ 0, 2, 2, 0, 0 ],
 [ 0, 0, 0, 0, 0 ]
]

this is the board representing the liberties for Black (stones of type -1)
[
 [ 0, 0, 0, 0, 0 ],
 [ 0, 0, 0, 0, 0 ],
 [ 0, 0, 0, 0, 0 ],
 [ 0, 0, 0, 0, 0 ],
 [ 0, 0, 0, 0, 2 ]
]
 */


/**
 * Calls a function on each adjacent tile with the same value as `value`
 * @param board 2D array of numbers
 * @param x x-coordinate of current tile
 * @param y y-coordinate of current tile
 * @param value Value to compare adjacent tiles against
 * @param fn Function to call on adjacent tiles with same value as `value`
 */
function forAdj2D(
    board: number[][],
    x: number,
    y: number,
    value: 0|1|-1,
    fn: (x: number, y: number) => void
    ) {
    const m = board.length
    const n = board[0].length
    if (x > 0     && board[x-1][y]   === value) fn(x-1,y)
    if (x < m - 1 && board[x+1][y]   === value) fn(x+1,y)
    if (y > 0     && board[x]  [y-1] === value) fn(x,  y-1)
    if (y < n - 1 && board[x]  [y+1] === value) fn(x,  y+1)
}

/**
 * Calls a function on each element of a 2D array
 * @param board 2D array of numbers
 * @param fn Function to call on each element of `board`
 */
function forEach2D(
    board: number[][],
    fn: (board: number[][], x: number, y: number) => void
  ) {
    board.forEach((row, i) => {
        row.forEach((_val, j) => {
            fn(board, i, j)
        })
    })
}

/**
 * Calculates the number of liberties for each stone on a Go board
 * @param board 2D array representing the Go board, with 0 for empty spaces, 1 for black stones, and -1 for white stones
 * @param stone Either 1 or -1, representing which color of stone to calculate liberties for
 * @returns A 2D array of the same dimensions as `board`, where each element contains the number of liberties for that stone
 */
function findLiberty(board: number[][], stone: 0|1|-1): number[][]
{
  const m = board.length;
  const n = board[0].length;

  const liberties = Array(m).fill(0).map(() => Array(n).fill(0));
  const visited = Array(m).fill(0).map(() => Array(n).fill(0));
  const q:[number,number][] = []

  forEach2D(board, (b:number[][],i:number,j:number) => {
    if(b[i][j] === stone && !visited[i][j]){
      q.push([i,j])

      while (q.length){
        const [i,j] = q.shift()!
        forAdj2D(b,i,j, 0,(_iAdj,_jAdj)=>{
          liberties[i][j]++;
        })
        forAdj2D(b,i,j, stone,(iAdj,jAdj)=>{
          if(!visited[iAdj][jAdj]) {
            q.push([iAdj,jAdj])
            visited[iAdj][jAdj] = true
          }
        })

      }
    }
  })

  return liberties
}
