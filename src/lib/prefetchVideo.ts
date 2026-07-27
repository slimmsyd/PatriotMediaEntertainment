/** Warm the browser cache for a video so it is ready when it enters view. */
export function prefetchVideo(src: string) {
  if (typeof document === "undefined" || !src) return;

  const id = `pme-preload-video:${src}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "preload";
  link.as = "video";
  link.href = src;
  link.setAttribute("fetchpriority", "low");
  document.head.appendChild(link);

  // Force a real media buffer (link preload alone is flaky across browsers)
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.src = src;
  void video.load();
}
