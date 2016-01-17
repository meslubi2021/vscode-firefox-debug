import { Log } from '../util/log';
import { Socket } from 'net';
import { DebugProtocolTransport } from './transport';
import { ActorProxy } from './actorProxy/interface';
import { RootActorProxy } from './actorProxy/root';

/**
 * Connects to a target supporting the Firefox Debugging Protocol and sends and receives messages
 */
export class DebugConnection {

	private transport: DebugProtocolTransport;
	private actors: Map<string, ActorProxy>;
	private _rootActor: RootActorProxy;

	constructor() {
		this.actors = new Map<string, ActorProxy>();
		this._rootActor = new RootActorProxy(this);
		let socket = new Socket();
		this.transport = new DebugProtocolTransport(socket);
		this.transport.on('message', (response: FirefoxDebugProtocol.Response) => {
			if (this.actors.has(response.from)) {
				this.actors.get(response.from).receiveResponse(response);
			} else {
				Log.error('Unknown actor: ' + JSON.stringify(response));
			}
		});
		socket.connect(6000);
	}

	public get rootActor() {
		return this._rootActor;
	}

	public sendRequest<T extends FirefoxDebugProtocol.Request>(request: T) {
		this.transport.sendMessage(request);
	}

	public register(actor: ActorProxy): void {
		this.actors.set(actor.name, actor);
	}

	public unregister(actor: ActorProxy): void {
		this.actors.delete(actor.name);
	}
	
	public getOrCreate<T extends ActorProxy>(actorName: string, createActor: () => T): T {
		if (this.actors.has(actorName)) {
			return <T>this.actors.get(actorName);
		} else {
			return createActor();
		}
	}
	
	public getOrCreatePromise<T extends ActorProxy>(actorName: string, createActor: () => Promise<T>): Promise<T> {
		if (this.actors.has(actorName)) {
			return Promise.resolve(this.actors.get(actorName));
		} else {
			return createActor();
		}
	}
}
