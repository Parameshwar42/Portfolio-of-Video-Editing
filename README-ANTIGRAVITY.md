# PARAMESHWAR Portfolio — Antigravity package

This is the complete current portfolio project: source code, images, posters, videos, and the editable portfolio-media.json. It is a buildless static site; the main page is index.html.

## Open it in Google Antigravity

1. Extract PARAMESHWAR-Portfolio-Antigravity.zip.
2. In Antigravity, create a Project and choose **Add Folder** to open the extracted PARAMESHWAR-PORTFOLIO folder.
3. To preview it locally, open Antigravity’s terminal in that folder and run:

    py -m http.server 8000

   Then visit http://127.0.0.1:8000/. Use an HTTP preview instead of opening index.html as file://, because browsers block the gallery JSON request from local files.

## Publish it publicly

Antigravity edits the project; a hosting service provides the public URL. One straightforward option for this version is GitHub Pages:

1. Create a GitHub repository for the portfolio. For a free public website, make the repository public.
2. In the project folder, open Antigravity’s terminal and run:

    git init
    git add .
    git commit -m "Publish PARAMESHWAR portfolio"
    git branch -M main
    git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
    git push -u origin main

   Replace the URL with your repository URL.
3. On GitHub, open the repository’s **Settings → Pages**. Set the publishing source to the main branch and / (root), then save. GitHub will show the public site URL on that page.

You can also ask Antigravity: “Publish this existing static portfolio with GitHub Pages. Preserve the cover, About Me, Skills, all gallery content and video behavior; only make the hosting changes needed. Keep the current media URLs and do not redesign the site.”

## Video hosting note

The package includes all five videos. The largest is about 85 MB, and the video files together are about 267 MB. GitHub allows files below 100 MiB in a regular Git repository, and GitHub Pages has a 1 GB published-site limit; the current videos fit those per-file and total-size limits. Public autoplay can use significant visitor bandwidth. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) · [GitHub large-file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

Cloudflare Pages limits each individual static asset to 25 MiB, so these MP4s cannot all be uploaded directly there; they would need public object storage or another video host, with the URLs updated in portfolio-media.json. [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

## Add or replace gallery videos

Edit portfolio-media.json and add an entry to featuredWork or reels. Keep the media files in media/ and use paths such as media/my-video.mp4; optional fields include posterUrl, editingStyle, and objectPosition. Preserve the existing array order unless you want to change display order.
