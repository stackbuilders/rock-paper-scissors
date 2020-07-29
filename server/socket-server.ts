import socketIO, {Server as IOServer, Socket as IOSocket} from "socket.io";

import {Server as HTTPServer} from "http";
import {SocketMessage} from "../contracts/sockets"

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}

type SocketActionFn<T> = (message: T) => void;

let io: (IOServer | null) = null;

// Wrapper functions

export function createSocketServer(server: HTTPServer) {
  io = socketIO(server);

  io.on("connection", (socket: IOSocket) => {
    registeredEvents.forEach(({ event, callback }) => {
      socket.on(event, callback);
    });
  });
}

export function broadcast<T>(event: SocketMessage) {
  return (message: T) => io?.emit(event, message);
}

export function createSocket<T>(
  event: SocketMessage,
  action?: SocketActionFn<T>
): WrappedServerSocket<T> {
  const callback = action || broadcast(event);
  return { event, callback };
}


// Socket Events

let status = "waiting";
let moves: Move[] = [];

const makeMoveEvent = createSocket<Move>("make_move", (move) => {
  if (status === "waiting") {
    moves.push(move);
    if(moves.length === 2){
      status = "locked";
      getWinner();
    }
  }
})

const getWinner = () => {
  const [move1, move2] = moves;

  if(move1.move === move2.move) {
    broadcast<void>("announce_tie")();
  } else {
    switch (move1.move) {
      case "rock":
        broadcast("announce_winner")(move2.move === "scissors" ? move1 : move2);
        break;
      case "paper":
        broadcast("announce_winner")(move2.move === "rock" ? move1 : move2);
        break;
      case "scissors":
        broadcast("announce_winner")(move2.move === "paper" ? move1 : move2);
        break;
    }
  }

  setTimeout(() => {
    status = "waiting";
    moves = [];
    broadcast<void>("reset")();
  }, 5000);
}

const registeredEvents = [
  makeMoveEvent
];
