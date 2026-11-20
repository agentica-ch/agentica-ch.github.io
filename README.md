# agentica.ch

Static website, served by GitHub Pages from the `main` branch.

- `de/index.html`, `en/index.html`: the two language versions (same sections, different texts)
- `index.html`: sends the visitor to `/de/` or `/en/`
- `assets/`: stylesheet, script, fonts, images

Preview locally: `python3 -m http.server 8090`, then open `http://127.0.0.1:8090/`.
