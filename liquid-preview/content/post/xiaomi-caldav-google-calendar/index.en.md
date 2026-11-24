---
title: "Syncing Google Calendar on Xiaomi HyperOS"
description: "A field test: the Google account was signed in but system calendar sync kept failing, so Xiaomi Calendar's built-in CalDAV import was used instead."
slug: xiaomi-caldav-google-calendar
date: "2026-11-24T22:23:45+08:00"
written: "2026.11"
note: true
hidden: true
share: false
license: false
---

> Tested on 24 November 2026.

I spent half a day trying to fix Google Calendar sync on a Xiaomi phone. The Google account was already signed in, and other sync items such as contacts had recent update records. The system calendar, however, kept failing.

In the end, there was no need to fight with Google Play services or install another app. Xiaomi Calendar supports CalDAV, so connecting it directly to Google Calendar solved the problem.

## Where the problem was

On the phone's Google account sync page, two similarly named items are easy to confuse: **Google Calendar** and **Calendar**.

On my phone, the first showed a successful sync that day, while the second kept returning an error. Its last successful sync was still 24 October 2025. Google events also failed to appear in the stock Xiaomi Calendar app.

Android's system calendar relies on a calendar sync adapter and the system calendar database. A working Google sign-in does not necessarily mean that the system calendar sync chain is healthy. I did not dig further into which component was at fault; I switched to a different sync method instead.

## The fix: use Xiaomi Calendar's built-in CalDAV support

CalDAV is an open protocol for accessing and synchronising calendars. Since Xiaomi Calendar supports it and Google Calendar exposes a CalDAV interface, it is possible to bypass the original Google account calendar sync mechanism.

All you need is a Google app-specific password and the CalDAV server address.

### 1. Generate a Google app-specific password

First, open [Google Account security settings](https://myaccount.google.com/security) and confirm that two-step verification is enabled.

Then open the [app passwords page](https://myaccount.google.com/apppasswords) and create a new password. The app name can be `Xiaomi Calendar`.

Google will generate a 16-character app-specific password. Copy it for later use and remove the spaces when entering it.

Note that this is an **app-specific password, not the password for your Google account**. If you stop using this sync setup later, you can revoke that password separately in your Google account.

### 2. Add a CalDAV account in Xiaomi Calendar

Open the stock Calendar app on the Xiaomi phone and go through:

**three-dot menu at the top right → Settings → Calendar account management → Import account → Import CalDAV account**

Then fill in the following fields. Assume the Google email address is `example@gmail.com`:

| Field | Value |
| --- | --- |
| Username | `example@gmail.com` |
| Password | The 16-character app-specific password just generated |
| Server address | `https://www.google.com/calendar/dav/example@gmail.com/user/` |

The server address can be copied from the line below:

```text
https://www.google.com/calendar/dav/example@gmail.com/user/
```

Replace `example@gmail.com` with your own Google email address, make sure the phone can reach Google services, and sign in.

After the account is added, go back to Xiaomi Calendar and check whether Google events have appeared. I succeeded with Google's legacy CalDAV endpoint.

## The main trap: old and new Google CalDAV endpoints

Much of the time I lost came from Google having changed its CalDAV interface.

Legacy endpoint:

```text
https://www.google.com/calendar/dav/
```

Current endpoint:

```text
https://apidata.googleusercontent.com/caldav/v2/
```

According to the [official Google developer guide](https://developers.google.com/workspace/calendar/caldav/v2/guide), the legacy endpoint has been deprecated and is no longer supported. The current endpoint requires OAuth 2.0 and does not support traditional Basic Authentication.

Xiaomi Calendar's CalDAV import screen, however, only offers a server address, username and password. There is no Google OAuth authorisation flow. As a result, copying the current endpoint from the official documentation cannot solve the authentication problem.

When I saw that the legacy endpoint had been deprecated, I assumed this route was closed. In practice, **as of 24 November 2026, the legacy endpoint still connected and successfully synced my Google events to the Xiaomi phone.**

Deprecation does not necessarily mean that a service has already been shut down. Still, because Google no longer offers official support, this method may stop working in the future, and it is not guaranteed to work for every account or system version.

## Is manual syncing needed afterwards?

CalDAV is different from a one-off ICS import. It supports ongoing synchronisation and can read and write events in both directions.

How Xiaomi Calendar performs background sync, how often it runs, and whether local edits are written back to Google Calendar still depend on the client implementation. What I confirmed was that the account connected and events were fetched. I have not yet verified long-term automatic syncing or two-way writes.

You can enable automatic sync of data in the phone settings, allow Xiaomi Calendar to use the network in the background, and make sure background network access to Google services works. Then create a Google event on a computer and see whether it appears on the phone automatically. That will tell you whether background syncing is working.

If the original Google Calendar sync starts working again, check for duplicate events and hide or disable the older sync source if necessary.

---

After half a day, the built-in feature in Xiaomi Calendar was what solved the problem. If you run into the same situation, try CalDAV before turning to more complicated solutions. At least in this test, no rooting, flashing or extra app installation was needed.

References: [Google CalDAV API developer guide](https://developers.google.com/workspace/calendar/caldav/v2/guide) · [Google app-specific password help](https://support.google.com/accounts/answer/185833?hl=en)
