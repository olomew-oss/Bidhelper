# BidHelper landing page

Static waitlist site for bidhelper.com — HVAC reverse-auction marketplace for homeowners and local companies.

## Files

- index.html — landing page markup
- styles.css — navy / amber responsive styles
- app.js — waitlist validation, optional Formspree POST, localStorage fallback
- vercel.json — cleanUrls + basic security headers

## Local preview

From this folder:

python3 -m http.server 8080

Or: npx serve .

Open http://localhost:8080

## Deploy on Vercel

### Dashboard

1. Push this folder to a Git repo.
2. In Vercel, Add New Project and import the repo.
3. Framework preset: Other (static).
4. Deploy to get a vercel.app URL.

### CLI

npm i -g vercel
cd bidhelper-landing
vercel
vercel --prod

## Custom domain (bidhelper.com) from GoDaddy

1. In Vercel project Settings Domains, add bidhelper.com and www.bidhelper.com.
2. Typical GoDaddy DNS: A record for @ to 76.76.21.21; CNAME for www to cname.vercel-dns.com (confirm IPs in Vercel UI).
3. Remove conflicting A/AAAA/CNAME records for @ and www.
4. Wait for DNS propagation; confirm Valid in Vercel.

## Formspree (waitlist)

1. Create a form at formspree.io and copy the endpoint.
2. In app.js set FORM_ENDPOINT to https://formspree.io/f/xxxxxx
3. Redeploy. Submissions go to Formspree; a copy is also saved in localStorage under bidhelper_waitlist.
4. Leave FORM_ENDPOINT empty for localStorage-only demos.

## License

(c) 2026 BidHelper. All rights reserved.