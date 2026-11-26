# Portfolio media

Place local `.mp4` or `.webm` files in this folder. In `portfolio-media.json`, point `videoUrl` to the file relative to the site root, such as `media/my-edit.mp4`. You can also use YouTube watch, Shorts, or `youtu.be` links, and Vimeo video links.

Each entry takes a `title` and `videoUrl`. `posterUrl`, `editingStyle`, and `objectPosition` are optional. Add entries to `featuredWork` for the wide montage or `reels` for 9:16 tiles. The gallery reads entries in array order. Keep both arrays empty to hide the showcase entirely.

Reels autoplay muted and loop inline with native playback controls. Autoplay is disabled when reduced motion is enabled. Featured Work videos remain click-to-play.

The direct `file://` preview uses a media fallback in `script.js` because browsers block JSON `fetch()` from local files. For edits made only in `portfolio-media.json` to appear, serve the site over HTTP. From the project folder, run `python -m http.server 8000`, then open `http://127.0.0.1:8000/`.
