import Log from "./util";
import {Timer} from "./util";

const WebSocket = require('ws');
let ws = new WebSocket('ws://www.host.com/path');

// TODO allow this to be extended with custom types
export enum MessageType {
    Open,
    Close
}

export interface Message {
    type: string;
    token: string;
    body: object;
}

// TODO these will be the types for the body of the message
export interface OpenMessage {

}

export interface CloseMessage {
    code: number;
    reason: string;
}


// // Some types are missing from the ws types file. We add the missing types here.
// declare class WebSocket extends WebSocketLib{
//   removeEventListener(type: string, func: (...args:any[]) => void): void;
// }

export default class WebSocketClient {
    private conn: WebSocket;
    private _host: string;
    private _user: string;

    /**
     * Create a WebSocket client that communicates with the specified server.
     *
     * @param host The full address to the server.
     */
    constructor(host: string, user: string) {
        this._host = host;
        this._user = user;
        ws = new WebSocket(this._host);
    }

    /**
     * Opens the connection to the server and performs a handshake.
     *
     * @throws Failed to connect to host <host>. <error details>
     */
    public async open() {
        return new Promise((fulfill, reject) => {
            try {
                this.conn = new WebSocket(this._host, {headers: {"user": this._user}});
                // If there is an error opening the connection, we reject. If an error
                // occurs later, we will log it (but the reject call will do nothing)
                this.conn.onerror = function (event) {
                    Log.warn("WebSocket error observed");
                    reject(event);
                };
                this.conn.onopen = function(){
                    fulfill();
                };
            }
            catch (err) {
                throw "Failed to connect to host " + this._host + ". " + err;
            }
        });
    }

    /**
     * Closes the connection with the server with an optional message describing
     * why the connection is being closed. The connection is forcibly closed if
     * the server doesn't reposond in the specified time.
     */
    public async close(msg?: CloseMessage, ms?: number): Promise<CloseMessage> {
        return new Promise<CloseMessage>((fulfill, reject) => {
            let t = new Timer();
            try {
                if (typeof(msg) === undefined)
                    this.conn.close();
                else
                    this.conn.close(msg.code, msg.reason);

                if (typeof(ms) !== undefined) {
                    t.wait(ms).then(() => ws.terminate);
                }

                this.conn.onclose = function(this: WebSocket, ev: CloseEvent) {
                    t.cancel();
                    fulfill();
                };
            }
            catch (err) {
                throw "Failed to close connection. " + err;
            }
        });
    }


    // do some processing
    public async send(data: object) {
        return new Promise((fulfill, reject) => {
            try {
                let msg = JSON.stringify(data);
                this.conn.send(msg);
            }
            catch (err) {
                throw "Failed to send message. " + err;
            }
        });
    }


    /**
     * Conveneince method to add a handler for incoming messages. Automatically
     * parses the message into a JSON object.
     *
     * @param listener The function that is called on each message received.
     * @param type If supplied, only call cb on messages with the specified type.
     * @returns A function handle that can be used to unregister the listener.
     *
     * @throws Failed to parse incoming message. <error details>
     * @throws Failed to register message listener. <err details>
     */
    public registerMessageListener(listener: (data: Message) => void, type?: string) {
        let msg: Message;
        try {
            let msgHandler = async function (data: string) {
                msg = JSON.parse(data);
                let response = await listener(msg);
                await this.send(response);
            };
            this.conn.onmessage(msgHandler.bind(this));
            return msgHandler;
        }
        catch (err) {
            throw "Failed to register message listener. " + err;
        }
    }


    /**
     *
     */
    // public unregisterMessageListener(listener: (data: string) => void) {
    //     try {
    //         this.conn.removeEventListener("message", listener);
    //     }
    //     catch (err) {
    //         throw "Failed to unregister message listener. " + err;
    //     }
    // }

    /**
     * Conveneince method for registering a callback function to handle WebSocket
     * errors. The returned function handle can be used to unregister the callback.
     *
     * @param cb The function to call when an error is received. It will be passed
     * an error object.
     * @returns A function handle for unregistering the listener.
     *
     * @throws Failed to register error listener. <error details>
     */
    // public registerErrorListener(listener: (error: Error) => void) {
    //     try {
    //         this.conn.onerror(function(error: Error){ return listener });
    //         return listener;
    //     }
    //     catch (err) {
    //         throw "Failed to register error listener. " + err;
    //     }
    // }


    /**
     *
     */
    // public unregisterErrorListener(listener: (error: Error) => void) {
    //     try {
    //         this.conn.removeListener("error", listener);
    //     }
    //     catch (err) {
    //         throw "Failed to unregister error listener. " + err;
    //     }
    // }


    /**
     * Register a listener for the specified event. The following events can be
     * registered:
     *  - close(code: number, reason: string) - Emitted when the connection is
     *    closed. code is a numeric value indicating the status code explaining
     *    why the connection has been closed. reason is a human-readable string
     *    explaining why the connection has been closed.
     *  - error(error: Error) - Emitted when an error occurs. Errors from the
     *    underlying net.Socket are forwarded here.
     *  - headers(headers: object, response: http.IncomingMessage) - Emitted when
     *    response headers are received from the server as part of the handshake.
     *    This allows you to read headers from the server, for example 'set-cookie'
     *    headers.
     *  - message(data: String|Buffer|ArrayBuffer|Buffer[]) - Emitted when a
     *    message is received from the server.
     *  - open() - Emitted when the connection is established.
     *  - ping(data: Buffer) - Emitted when a ping is received from the server.
     *  - pong(data: Buffer) - Emitted when a pong is received from the server.
     *  - unexpected-response(request: http.ClientRequest, response: http.IncomingMessage) -
     *    Emitted when the server response is not the expected one, for example a
     *    401 response. This event gives the ability to read the response in order
     *    to extract useful information. If the server sends an invalid response
     *    and there isn't a listener for this event, an error is emitted.
     *
     * @param type The name of the event.
     * @param cb The function to call when the specified event is emitted.
     * @returns The handle of the callback function. Use this to unregister the
     * listener.
     *
     * @throws Failed to register listener for event '<event>'. <error details>
     */
    public registerListener(type: string, listener: (...args: any[]) => void) {
        try {
            ws.on(type, listener);
            return listener;
        }
        catch (err) {
            throw "Failed to register listener for event '" + type + "'. " + err;
        }
    }


    public unregisterListener(type: string, listener: (...args: any[]) => void) {
        try {
            ws.removeListener(type, listener);
        }
        catch (err) {
            throw "Failed to remove listener for event '" + type + "'. " + err;
        }
    }


}
