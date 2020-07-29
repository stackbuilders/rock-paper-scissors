type MoveType = "rock" | "paper" | "scissors";

interface Player {
  name: string;
}

interface Move {
  player: Player;
  move: MoveType;
}
