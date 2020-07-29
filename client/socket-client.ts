import { SocketMessage } from "contracts/sockets";
import socketIOClient from "socket.io-client";

interface EmitterCallback<T> {
  (data: T): void;
}

interface WrappedClientSocket<T> {
  emit: (data: T) => SocketIOClient.Socket;
  on: (callback: EmitterCallback<T>) => SocketIOClient.Emitter;
  off: (callback: EmitterCallback<T>) => SocketIOClient.Emitter;
}

const socketClient = socketIOClient();

function createSocket<T>(event: SocketMessage): WrappedClientSocket<T> {
  return {
    emit: (data) => socketClient.emit(event, data),
    on: (callback) => socketClient.on(event, callback),
    off: (callback) => socketClient.off(event, callback),
  };
}

// Client socket wrappers

export const socketMakeMove = createSocket<Move>("make_move");
export const socketAnnounceTie = createSocket<void>("announce_tie");
export const socketAnnounceWinner = createSocket<Move>("announce_winner");
export const socketReset = createSocket<void>("reset");

export default socketClient;
