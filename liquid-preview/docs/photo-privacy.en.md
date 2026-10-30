# Question-based access to portrait photos

Enable protection only for selected portraits. Solo photos of the owner and unmarked photos stay public. The default question is “Who is one of the people in this photo, other than me?” A group photo can accept several names, nicknames, or English names. Questions, errors, and unlock states are available in Chinese and English.

The public image URL serves a heavily blurred preview. A clear web copy is encrypted with AES-256-GCM. Each accepted answer derives a wrapping key using PBKDF2-SHA-256 with its own salt and 600,000 iterations, unlocking the same random image key. HTML and JavaScript contain neither plaintext answers nor clear image URLs. Unlocked images exist only in page memory. Closing the viewer revokes the Blob URL; reloading requires answering again.

## Configuration

Keep original photos, answers, and private configuration outside the repository, for example under `/Users/xiaojs20/Life/blog-private/portraits/`. Preserve camera originals. The tool creates a separate web copy with corrected orientation, a maximum long edge of 2,400 pixels, and no EXIF, GPS, or XMP metadata.

Private JSON configuration:

```json
{
  "photos": [
    {
      "src": "/img/travel/city/20261030-city-scene.jpg",
      "original": "/directory-outside-the-repository/original.jpg",
      "answers": ["Accepted name", "Nickname"]
    }
  ]
}
```

`src` matches a travel album’s `src` or a photo wall entry’s `image`. It remains the preview URL, so existing direct image links also show the blurred version. The default preview blurs the entire selected portrait. `answers: []` disables unlocking until names are confirmed. Override the default question globally or per photo with `question: {"zh": "中文问题", "en": "English question"}`.

Before running the tool, copy the selected web photos into a private originals directory outside the repository:

```sh
node liquid-preview/scripts/prepare-photo-privacy.mjs \
  --config /Users/xiaojs20/Life/blog-private/portraits/config.json \
  --published /Users/xiaojs20/Life/blog
node liquid-preview/scripts/check-photo-privacy.mjs --published /Users/xiaojs20/Life/blog
```

This updates Hugo data, blurred previews and ciphertext under `static`, and matching image assets in the existing `--published` directory. **Build and synchronize both language versions of the album pages, scripts, and styles before publishing everything together.** The command does not publish the site or rewrite HTML.

To change answers, rerun the tool with the same private original, generating a new random key and ciphertext. Include any old aliases you still want to accept. Do not remove manifest entries to restore public access without explicitly restoring the web image and rebuilding. Previously published ciphertext may still accept previous answers; re-encryption cannot revoke old copies.

## Verification and limits

```sh
node --test liquid-preview/scripts/photo-privacy.test.mjs
node liquid-preview/scripts/check-photo-privacy.mjs --published /build/output
```

The deployment workflow verifies preview and ciphertext hashes, then blocks publication if an identical clear copy is found in public directories. It cannot detect recompressed or cropped copies; check those separately. No identity recognition is performed. The owner supplies the names.

A static site cannot limit offline answer guesses. Protection depends on how difficult the accepted answers are to guess. People who know a name can unlock and save the image. This feature cannot recall previously public clear images, Git history, or third-party caches. Private storage and server-side validation are needed to remove historical repository originals or enforce attempt limits.

Encryption references: [PBKDF2 key derivation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey), [AES-GCM parameters](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams).
