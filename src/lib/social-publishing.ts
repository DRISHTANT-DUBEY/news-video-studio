export type Platform='youtube'|'shorts'|'instagram';
export type PublishStatus='draft'|'awaiting_connection'|'awaiting_render'|'ready'|'scheduled'|'uploading'|'processing'|'published'|'failed'|'cancelled';
export type Visibility='public'|'private'|'unlisted';
export type Variant='landscape'|'vertical';
export interface ExportPreset {width:number;height:number;fps:number;container:'mp4';videoCodec:'h264';audioCodec:'aac';aspectRatio:'16:9'|'9:16'}
export const PRESETS:Record<Variant,ExportPreset>={
 landscape:{width:1920,height:1080,fps:30,container:'mp4',videoCodec:'h264',audioCodec:'aac',aspectRatio:'16:9'},
 vertical:{width:1080,height:1920,fps:30,container:'mp4',videoCodec:'h264',audioCodec:'aac',aspectRatio:'9:16'}
};
export const PLATFORM_VARIANT:Record<Platform,Variant>={youtube:'landscape',shorts:'vertical',instagram:'vertical'};
export interface PublishingDraft {id:string;platforms:Platform[];caption:string;scheduledLocal:string;timeZone:'Asia/Kolkata';scheduledAtUtc:string;youtubeVisibility:Visibility;status:'draft';createdAt:string}
export const DEFAULT_CAPTION='Breaking News | Latest updates from our newsroom';
export const DEFAULT_LOCAL_TIME='2026-10-24T18:00';
export const DEFAULT_UTC_TIME='2026-10-24T12:30:00.000Z';
export function requiredVariants(platforms:Platform[]):Variant[]{return [...new Set(platforms.map(p=>PLATFORM_VARIANT[p]))]}
export function validateDraft(draft:PublishingDraft):string[]{
 const errors:string[]=[];
 if(!draft.platforms.length)errors.push('Select a publishing destination.');
 if(!draft.caption.trim())errors.push('Caption is required.');
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(draft.scheduledLocal))errors.push('Invalid local date/time.');
 if(!Number.isFinite(Date.parse(draft.scheduledAtUtc)))errors.push('Invalid UTC schedule.');
 if(Date.parse(draft.scheduledAtUtc)<=Date.now())errors.push('Schedule must be in the future.');
 return errors;
}
