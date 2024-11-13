export interface Game {
    board: string[];
    player1: string;
    player2: string;
    turn: number;
    winner: string | undefined;
}