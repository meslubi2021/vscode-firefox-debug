import { ThreadAdapter, VariableAdapter, FrameAdapter } from './index';

/**
 * This interface must be implemented by any adapter that can provide child variables.
 */
export interface VariablesProvider {
	readonly variablesProviderId: number;
	readonly threadAdapter: ThreadAdapter;
	readonly referenceFrame: FrameAdapter | undefined;
	readonly referenceExpression: string | undefined;
	getVariables(): Promise<VariableAdapter[]>;
}
