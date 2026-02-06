export type RequestParams = unknown[] | undefined;
export type RequestResult = unknown | undefined;
export type SendEvent = (method: string, params: Record<string, unknown>) => void;

export interface ControllerModule {
  handleRequest(method: string, params?: RequestParams): RequestResult;
}
