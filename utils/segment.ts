export function segmentTrack(event: string, properties: any) {
  window["analytics"]?.track(event, properties);
}
