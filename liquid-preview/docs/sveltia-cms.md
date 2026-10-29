# Sveltia CMS setup

Liquid Stack includes a generated Sveltia CMS configuration at `/admin/`. Before using it, update the `backend.repo`, `site_url`, and `display_url` placeholders in `assets/admin/cms-config-base.yml`.

For a simple private workflow, open `/admin/` and choose **Sign In with Token**. Create a fine-grained GitHub token that has **Contents: Read and write** access only to your Liquid Stack repository; paste it into the CMS when prompted. The token stays in your browser storage.

For public OAuth sign-in, host a compatible GitHub OAuth proxy and add its endpoint to the CMS backend configuration. Do not commit tokens, OAuth secrets, or service credentials.
