# H Studio

A static React site for a creative portrait drawing studio, built with Vite and deployed through GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Publish

Push the `main` branch to GitHub, then choose **GitHub Actions** under **Settings → Pages → Build and deployment → Source**. The included workflow builds and publishes the site automatically.

Leave `CNAME` empty until you have a custom domain. When ready, move it into a `public` folder and put only the domain name in the file, for example `portraits.example.com`.
