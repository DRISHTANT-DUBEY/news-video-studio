export type RenderMode='local'|'cloud';
export type RenderSpec={headline:string;presetId:string;fps:number;width:number;height:number;audioBedGain:number;};
export type RenderProgress={phase:'preparing'|'normalizing'|'encoding'|'muxing'|'completed';percent:number};
export interface RenderEngine{render(input:File,spec:RenderSpec,onProgress:(p:RenderProgress)=>void,signal:AbortSignal):Promise<Blob>}
