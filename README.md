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
  brandEn: "Astra",
  brandCn: "星途国际英语",
  brandFull: "Astra 星途国际英语",
  brandMark: "A",
  tagline: "由真实海外在校生带你点亮留学星途，完成从申请英语到大学英语的过渡。",
  wechatId: "AstraGlobal",             // TODO: replace with your real WeChat ID
  email: "yc677liu@gmail.com",         // public contact / fallback email
  submitEndpoint: "",                  // paste the generated endpoint URL here
  submitContentType: "application/json",
  submitBodyFormat: "json",
  netlifyFormName: "astra-submissions",
  submissionRecipientEmail: "yc677liu@gmail.com"
};
```

> The WeChat ID is still a placeholder. The intended official receiving email
> for consultation submissions is `yc677liu@gmail.com`. A backward-compatible
> `window.PEERPATH_CONFIG` alias is kept so older references keep working.

- **WeChat QR code** — replace `assets/wechat-qr.svg` with your real QR image
  (keep the same filename, or update the `<img src>` in `contact.html`).
- **Local backup** — every contact request and placement-test result is still
  saved in this browser's `localStorage`, so `admin.html` can be used during
  early operations. This is not enough for a live site because parent submissions
  from other devices will stay in their browsers unless `submitEndpoint` is set.

## Receive real submissions

The contact form and placement test both send the same kind of request when
`submitEndpoint` is configured:

- HTTP method: `POST`
- Default header: `Content-Type: application/json`
- Body: JSON
- Success condition: HTTP `2xx`; otherwise the contact form shows a failure and
  does not claim the booking was delivered.

### Option 1: FormSubmit email notifications

This is the easiest static-site option and the current configured choice.
It does not require an account, but the first real submission usually sends a
confirmation email to the recipient. Open that email and confirm the address,
then future submissions will arrive in the inbox.

The current `js/config.js` is already configured for:

```js
submitEndpoint: "https://formsubmit.co/ajax/yc677liu@gmail.com",
submitContentType: "application/json",
submitBodyFormat: "json",
submissionRecipientEmail: "yc677liu@gmail.com"
```

When testing for the first time:

1. Submit the consultation form on the website once.
2. Check `yc677liu@gmail.com` for the FormSubmit activation email.
3. Click the activation/confirmation link.
4. Submit the form again; the second submission should arrive as a normal email.

### Option 2: Formspree or Basin email notifications

Use this if you prefer a managed dashboard.

1. Create a form in [Formspree](https://formspree.io) or [Basin](https://usebasin.com).
2. Set the form notification / recipient email to `yc677liu@gmail.com`.
3. Copy the generated endpoint URL.
4. Replace the FormSubmit URL in `js/config.js`.

Formspree:

```js
submitEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
submitContentType: "application/json",
submitBodyFormat: "json",
submissionRecipientEmail: "yc677liu@gmail.com"
```

Basin:

```js
submitEndpoint: "https://usebasin.com/f/YOUR_BASIN_FORM_ID",
submitContentType: "application/json",
submitBodyFormat: "json",
submissionRecipientEmail: "yc677liu@gmail.com"
```

No private keys or service secrets belong in this repo. The endpoint URL is the
only value the static site needs.

### Option 3: Google Apps Script for Sheets + email

Use this if you want each submission written to Google Sheets and emailed to
`yc677liu@gmail.com`.

1. Create a Google Sheet and copy its spreadsheet ID.
2. Open **Extensions → Apps Script** and add a `doPost` handler like this:

```js
var SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID";
var RECIPIENT_EMAIL = "yc677liu@gmail.com";

function doPost(e) {
  var payload = JSON.parse((e.postData && e.postData.contents) || "{}");
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Submissions");
  if (!sheet) {
    sheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet("Submissions");
    sheet.appendRow(["submittedAt", "type", "name", "contact", "payload"]);
  }

  var student = payload.student || {};
  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.type || "",
    payload.name || student.name || "",
    payload.contact || student.email || student.wechat || student.phone || "",
    JSON.stringify(payload)
  ]);

  MailApp.sendEmail({
    to: RECIPIENT_EMAIL,
    subject: "New Astra submission: " + (payload.type || "unknown"),
    body: JSON.stringify(payload, null, 2)
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy it as a **Web app** with access set to **Anyone**.
4. Paste the `/exec` URL into `js/config.js`. Apps Script often works best with
   a JSON string sent as `text/plain` to avoid browser CORS preflight:

```js
submitEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
submitContentType: "text/plain;charset=utf-8",
submitBodyFormat: "json",
submissionRecipientEmail: "yc677liu@gmail.com"
```

### Option 4: Netlify Forms

If hosting on Netlify, `contact.html` includes a hidden
`astra-submissions` form so Netlify can detect the form at deploy time.
Netlify Forms expects URL-encoded form data, so use the built-in compatibility
mode. The full JSON submission is preserved in a `payload` field.

```js
submitEndpoint: "/",
submitContentType: "application/x-www-form-urlencoded;charset=UTF-8",
submitBodyFormat: "form",
netlifyFormName: "astra-submissions",
submissionRecipientEmail: "yc677liu@gmail.com"
```

Then enable form notifications in Netlify and send them to
`yc677liu@gmail.com`.

### Expected payload

Every remote submission includes:

- `type`: `consultation_request` or `placement_test`
- `submittedAt`: ISO timestamp
- `site`: site/brand name
- `pageUrl`: page where the submission happened
- `recipientEmail`: configured receiving email for bookkeeping

Contact requests also include `name`, `contact`, `preferred`, and `message`.

Placement tests also include `student`, `responses`, `score`, `level`, `skills`,
`timeUsedSeconds`, `timedOut`, and `testVersion`.

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
