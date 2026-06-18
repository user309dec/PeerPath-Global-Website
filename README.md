# Astra 星途国际英语 — Website (v1)

> 由真实海外在校生带你点亮留学星途，完成从申请英语到大学英语的过渡。
> A remote study-abroad English training platform for students preparing to study overseas.

This repository contains the **first version** of the Astra 星途国际英语 website: a
fast, fully static site (plain HTML / CSS / JavaScript — no build step, no
framework) that runs anywhere. It implements brand pages, a working **TOEFL
Reading placement test** with timer and auto-scoring, lead capture, and a simple
back-office for reviewing submissions.

Branding is centralized: the brand name, tagline, WeChat ID and email all live in
`js/config.js`. `js/main.js` injects the brand fields into every element marked
with `data-brand-en` / `data-brand-cn` / `data-brand-mark` / `data-tagline`, so a
single edit updates the whole site.

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| 首页 Home | `index.html` | Brand slogan, value props, test entry, programs, flow, CTAs |
| 我们的故事 Our Story | `story.html` | Founder background & why Astra was created |
| 入学诊断测验 Placement Test | `placement-test.html` | Student info form → timed TOEFL Reading test → result |
| 课程 Programs | `programs.html` | 托福阅读入学诊断, 托福全科核心课程, 口语实战实验室, 学术写作精修课, 大学英语衔接课程 (with audience, duration, outcomes & modules) |
| 导师 Mentors | `mentors.html` | Overseas student mentor profiles & matching |
| 学习流程 How It Works | `how-it-works.html` | Diagnose → consult → recommend → learn → weekly feedback |
| 常见问题 FAQ | `faq.html` | Placement, official-test disclaimer, results, enrollment, payment |
| 联系我们 Contact | `contact.html` | WeChat QR + ID, booking form, email |
| 后台记录 Back Office | `admin.html` | Internal viewer for test submissions & consultation requests |

## The placement test

- **Step 1** — collects student basic info (name, email, WeChat, city, grade,
  goal, timeline). Name + a valid email are required.
- **Step 2** — renders the test from `js/test-data.js`: two original academic
  reading passages, 13 single- and multiple-answer questions, a **30-minute
  timer** (auto-submits on expiry), a live progress bar, and a submit
  confirmation.
- **Step 3** — auto-scores the test, shows percentage, level band
  (Foundational → Advanced), a per-skill breakdown, a recommended program, and
  routes the student to **add WeChat / book a consultation**. The student can
  also download their answer record as JSON.

Every submission is saved to the browser's `localStorage` and (if configured)
POSTed to a backend endpoint. The team can review records at `admin.html`.

## Configure it for your team

Edit **`js/config.js`**:

```js
window.ASTRA_CONFIG = {
  brandEn:   "Astra",                  // English brand name
  brandCn:   "星途国际英语",            // Chinese brand name
  brandFull: "Astra 星途国际英语",      // full brand (used in copy)
  brandMark: "A",                      // logo monogram
  tagline:   "由真实海外在校生带你点亮留学星途，完成从申请英语到大学英语的过渡。",
  wechatId:  "AstraGlobal",            // TODO: replace with your real WeChat ID
  email:     "hello@astraedu.com",     // TODO: replace with your real email
  submitEndpoint: ""                   // optional backend URL (see below)
};
```

> The contact details above (`wechatId` / `email`) are **placeholders** — update
> them to your real account before going live. A backward-compatible
> `window.PEERPATH_CONFIG` alias is kept so older references keep working.

- **WeChat QR code** — replace `assets/wechat-qr.svg` with your real QR image
  (keep the same filename, or update the `<img src>` in `contact.html`).
- **Collecting submissions across devices** — `localStorage` is per-browser, so
  `admin.html` only shows records from the same browser. To gather submissions
  centrally, set `submitEndpoint` to a form/back-end URL. Anything that accepts
  a JSON `POST` works, e.g.:
  - [Formspree](https://formspree.io) / [Basin](https://usebasin.com) form endpoint
  - A Google Apps Script web app
  - Your own API
  Both the placement test and the contact form will POST their JSON payloads there.

## Edit the test questions

All questions live in **`js/test-data.js`**. Each question has a `type`
(`"single"` or `"multi"`), `options`, and either `answer` (index) or `answers`
(array of indexes) plus `points`. Add passages or questions by extending the
`passages` array — the test engine and scoring adapt automatically.

## Run / deploy

No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

Deploy by uploading the folder to any static host — **GitHub Pages**, Netlify,
Vercel, Cloudflare Pages, or your own server.

> **Note on Wix:** the original brief mentioned Wix. Wix sites are built in
> Wix's visual editor and can't be assembled from source files like this, so
> this repo delivers the same functionality as a standalone, host-anywhere
> site. The content, copy, and test logic here can also be reused when
> rebuilding inside Wix (e.g. pasting copy into pages and porting the test logic
> into Wix Velo / custom code).

## Design

Modern, clean, education-focused. Navy/blue & white palette, responsive down to
mobile, accessible nav and forms. Tone is professional and trustworthy — no
"guaranteed score" / "guaranteed admission" claims, per the brief.

## Disclaimer

The placement test is an **unofficial practice assessment** for diagnostic use.
TOEFL is a registered trademark of ETS; Astra 星途国际英语 is not affiliated with ETS.
