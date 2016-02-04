import { Log } from '../util/log';
import { ThreadActorProxy, SourceActorProxy, BreakpointActorProxy } from '../firefox/index';
import { Source, StackFrame } from 'vscode-debugadapter';

export class ThreadAdapter {
	public id: number;
	public actor: ThreadActorProxy;
	public sources: SourceAdapter[];
	
	public constructor(id: number, actor: ThreadActorProxy) {
		this.id = id;
		this.actor = actor;
		this.sources = [];
	}
}

export class SourceAdapter {
	public actor: SourceActorProxy;
	public currentBreakpoints: Promise<BreakpointAdapter[]>;
	
	public constructor(actor: SourceActorProxy) {
		this.actor = actor;
		this.currentBreakpoints = Promise.resolve([]);
	}
}

export class BreakpointAdapter {
	public requestedLine: number;
	public actualLine: number;
	public actor: BreakpointActorProxy;
	
	public constructor(requestedLine: number, actualLine: number, actor: BreakpointActorProxy) {
		this.requestedLine = requestedLine;
		this.actualLine = actualLine;
		this.actor = actor;
	}
}

