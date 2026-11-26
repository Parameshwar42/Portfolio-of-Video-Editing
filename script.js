(() => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncMotionPreference = () => {
    document.documentElement.classList.toggle("motion-off", preference.matches);
  };

  syncMotionPreference();
  preference.addEventListener?.("change", syncMotionPreference);

  const workShowcase = document.querySelector(".work-showcase");
  // file:// pages cannot fetch JSON in most browsers, so keep the current item available for direct local previews.
  const localFilePreviewMedia = {
    featuredWork: [
      {
        title: "Featured Edit 01",
        videoUrl: "media/featured-edit-01.mp4",
        posterUrl: "media/featured-edit-01-poster.png",
      },
      {
        title: "Video Project 2",
        videoUrl: "media/video-project-2.mp4",
        posterUrl: "media/video-project-2-poster.jpg",
      },
    ],
    reels: [
      {
        title: "Parenting — Gold Glow",
        videoUrl: "media/parenting-final-gold-glow-1080x1920.mp4",
        posterUrl: "media/parenting-final-gold-glow-poster.jpg",
      },
      {
        title: "Editing Sample 01",
        videoUrl: "media/editing-sample-01-181848.mp4",
        posterUrl: "media/editing-sample-01-poster.jpg",
      },
      {
        title: "Editing Sample 02",
        videoUrl: "media/editing-sample-02-182551.mp4",
        posterUrl: "media/editing-sample-02-poster.jpg",
      },
    ],
  };

  function resolveVideoUrl(rawUrl) {
    if (typeof rawUrl !== "string" || !rawUrl.trim()) return null;

    let candidate = rawUrl.trim();
    if (candidate.startsWith("//")) candidate = `https:${candidate}`;
    if (/^(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    }

    let url;
    try {
      url = new URL(candidate, document.baseURI);
    } catch {
      return null;
    }

    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      videoId = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || "";
    }

    if (/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
      return {
        type: "embed",
        url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?playsinline=1&rel=0`,
        autoplayParameter: "autoplay=1&",
      };
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      videoId = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1] || "";
      if (videoId) {
        return {
          type: "embed",
          url: `https://player.vimeo.com/video/${videoId}?dnt=1`,
          autoplayParameter: "autoplay=1&",
        };
      }
    }

    if (/\.(?:mp4|webm)$/i.test(url.pathname)) {
      return { type: "file", url: rawUrl.trim() };
    }

    return null;
  }

  function makeVideo(entry, title, posterUrl, objectPosition, options = {}) {
    const autoplay = options.autoplay === true;
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = autoplay ? "auto" : "metadata";
    video.setAttribute("aria-label", `${title} video`);
    if (posterUrl) video.poster = posterUrl;
    if (objectPosition) video.style.objectPosition = objectPosition;
    video.src = entry.videoUrl.trim();
    video.autoplay = autoplay;
    video.loop = options.loop === true;
    video.muted = options.muted === true;
    if (video.muted) video.setAttribute("muted", "");
    return video;
  }

  function makeEmbed(title, source, autoplay = false) {
    const iframe = document.createElement("iframe");
    const autoplayPrefix = autoplay ? source.autoplayParameter : "";
    const embedUrl = autoplay
      ? source.url.replace("?", `?${autoplayPrefix}`)
      : source.url;
    iframe.src = embedUrl;
    iframe.title = `${title} video player`;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    return iframe;
  }

  function makePosterButton(title, posterUrl, objectPosition) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "work-poster-button";
    button.setAttribute("aria-label", `Play ${title}`);

    const image = document.createElement("img");
    image.src = posterUrl;
    image.alt = "";
    image.loading = "lazy";
    if (objectPosition) image.style.setProperty("--poster-position", objectPosition);

    const playMark = document.createElement("span");
    playMark.className = "work-play-mark";
    playMark.setAttribute("aria-hidden", "true");

    button.append(image, playMark);
    return button;
  }

  function makeMediaTile(entry, kind, index) {
    if (!entry || typeof entry.title !== "string" || !entry.title.trim()) return null;
    if (typeof entry.videoUrl !== "string" || !entry.videoUrl.trim()) return null;

    const title = entry.title.trim();
    const source = resolveVideoUrl(entry.videoUrl);
    if (!source) return null;

    const posterUrl = typeof entry.posterUrl === "string" ? entry.posterUrl.trim() : "";
    const editingStyle = typeof entry.editingStyle === "string" ? entry.editingStyle.trim() : "";
    const objectPosition = typeof entry.objectPosition === "string" ? entry.objectPosition.trim() : "";
    const tileKind = kind === "reels" ? "reel" : "featured";

    const figure = document.createElement("figure");
    figure.className = `work-tile work-tile--${tileKind}`;
    if (tileKind === "featured" && index % 3 === 0) figure.classList.add("work-tile--wide");

    const frame = document.createElement("div");
    frame.className = "work-frame";

    if (source.type === "file") {
      const video = makeVideo(entry, title, posterUrl, objectPosition, {
        autoplay: !preference.matches,
        loop: true,
        muted: true,
      });
      frame.append(video);
      if (video.autoplay) video.play().catch(() => {});
    } else if (source.type === "embed" && posterUrl) {
      const posterButton = makePosterButton(title, posterUrl, objectPosition);
      posterButton.addEventListener("click", () => {
        const iframe = makeEmbed(title, source, true);
        posterButton.replaceWith(iframe);
        iframe.focus({ preventScroll: true });
      }, { once: true });
      frame.append(posterButton);
    } else if (source.type === "file") {
      frame.append(makeVideo(entry, title, "", objectPosition));
    } else {
      frame.append(makeEmbed(title, source));
    }

    const caption = document.createElement("figcaption");
    caption.className = "work-caption";

    const titleElement = document.createElement("h3");
    titleElement.className = "work-title";
    titleElement.textContent = title;
    caption.append(titleElement);

    if (editingStyle) {
      const styleLabel = document.createElement("span");
      styleLabel.className = "work-editing-style";
      styleLabel.textContent = editingStyle;
      caption.append(styleLabel);
    }

    figure.append(frame, caption);
    return figure;
  }

  function renderPanel(kind, entries) {
    const panel = workShowcase.querySelector(`[data-media-panel="${kind}"]`);
    const grid = workShowcase.querySelector(`[data-media-grid="${kind}"]`);
    if (!panel || !grid) return false;

    const items = Array.isArray(entries) ? entries : [];
    const tiles = items.map((entry, index) => makeMediaTile(entry, kind, index)).filter(Boolean);
    if (kind === "featured" && tiles.length === 2) {
      tiles.forEach((tile) => tile.classList.remove("work-tile--wide"));
    }
    grid.replaceChildren(...tiles);
    panel.hidden = tiles.length === 0;
    return tiles.length > 0;
  }

  async function loadWorkShowcase() {
    if (!workShowcase) return;
    const isLocalFile = window.location?.protocol === "file:";

    function showLocalFilePreview() {
      const hasFeatured = renderPanel("featured", localFilePreviewMedia.featuredWork);
      const hasReels = renderPanel("reels", localFilePreviewMedia.reels);
      workShowcase.hidden = !(hasFeatured || hasReels);
    }

    try {
      const response = await fetch(new URL("portfolio-media.json", document.baseURI), { cache: "no-store" });
      if (!response.ok) {
        if (isLocalFile) showLocalFilePreview();
        return;
      }

      const media = await response.json();
      const hasFeatured = renderPanel("featured", media?.featuredWork);
      const hasReels = renderPanel("reels", media?.reels);
      workShowcase.hidden = !(hasFeatured || hasReels);
    } catch {
      if (isLocalFile) showLocalFilePreview();
      // Keep the showcase collapsed if the optional media file cannot be read over HTTP.
    }
  }

  void loadWorkShowcase();
})();
