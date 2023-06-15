

import { io } from 'socket.io-client'
 
interface CreateWsOptions {
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  onMessage?: (data?: any) => void;
  onOnLine?: (data?: any) => void;
  onTaskUpdate?: (data?: any) => void;
  onClose?: (event: CloseEvent) => void;
}

let wsInstance: WebSocket | null = null;

enum EventType {
  MESSAGE = 'message',
  ONLINE = 'online',
  TASK_UPDATE = 'task_update'
}

export const createWebsocket = (ops?: CreateWsOptions) => {
  if (wsInstance) {
    return wsInstance;
  }
  
  const dispatchEventData = (type: EventType, data: any) => {
    switch (type) {
      case EventType.MESSAGE:
        ops?.onMessage?.(data);
        break
      case EventType.ONLINE:
        ops?.onOnLine?.(data);
        break
      case EventType.TASK_UPDATE:
        ops?.onTaskUpdate?.(data);
        break
    }
  }

  console.log("ws url: ", import.meta.env.VITE_APP_WS_URL);
  const socket = io(import.meta.env.VITE_APP_WS_URL);
  socket.on(EventType.TASK_UPDATE, (data) => {
    console.log("data get: ", data)
    ops?.onTaskUpdate?.(data)
  })
  // const ws = wsInstance = new WebSocket("ws://localhost:3333/socket.io/");
  // ws.addEventListener('open', (event) => {
  //   console.log('open')
  //   ws.send(JSON.stringify({
  //     event: 'init',
  //     // data: {
  //     //   a: 123,
  //     //   b: 456
  //     // }
  //   }))
  //   ops?.onOpen?.(event)
  // });
  // ws.addEventListener('error', (error) => {
  //   console.log(error)
  //   ops?.onError?.(error)
  // });
  // ws.addEventListener('message', (event: MessageEvent) => {
  //   let data
  //   try {
  //     data = JSON.parse(event.data)
  //     const { event: type, data: eventData } = data
  //     dispatchEventData(type, eventData)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // });
  // ws.addEventListener('close', ops?.onClose);
  return socket;
}

export const sendMessage = (data: any) => {
  if (!wsInstance) {
    throw new Error('ws instance is not exist!')
  }
  wsInstance.send(JSON.stringify({
    type: 'message',
    data
  }))
}