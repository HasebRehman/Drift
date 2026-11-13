# Instagram carousel

## Current client demo

The homepage uses the seven public image posts supplied by you, in your chosen order,
immediately after Sign Up & Tap In. Swipe horizontally or use the arrow buttons.
Instagram renders each post in its own embedded frame, including video playback.
No token, numeric account ID, or account login is needed in the website configuration.

Edit the links in `src/data/instagram.ts` to change this selection. Tracking parameters
have been removed from the supplied links. This fixed selection does not automatically
add future posts. Instagram must allow embedding for each post; visitors may see an
Instagram login/unavailable message if Instagram restricts it or a blocker interferes.
The demo crops the embed header/footer to emphasize the portrait media and removes
the extra links below each card. This is a visual crop, not a native media player: 
Instagram can still show playback/login overlays, and its layout changes can affect
the crop. For a fully controlled media-only presentation, use client-provided image
and video files or the authorized API feed.

## Later: automatic latest posts

To use the automatic API feed after client authorization, change
`INSTAGRAM_FEED_MODE` to `'automatic'` in `src/data/instagram.ts`, then follow the
setup below. Keep it set to `'curated'` for the current demo.


The homepage displays the latest 10 posts/Reels from @drift.retail after the newsletter.
Posts are ordered by publish time, not likes or pinned profile position. Album posts
show their cover image; View on Instagram opens the complete post. Videos play on
request. The feed is cached for five minutes and open pages check every five minutes.

## Activate the feed

1. Use a Business or Creator Instagram account for drift.retail.
2. In Meta for Developers, create/configure an app with Instagram API with Instagram
   Login. Authorize drift.retail with the instagram_business_basic permission.
3. Obtain a long-lived Instagram User access token. A numeric account ID is optional:
   the server uses the account authorized by the token automatically.
   Use credentials for Instagram Login, not a Facebook Page token.
4. Add these privately to .env.local and your hosting environment settings:

```dotenv
INSTAGRAM_ACCESS_TOKEN="your-authorized-long-lived-token"
```

5. Restart locally; save the token for Production and redeploy on your host.

A profile URL alone cannot activate automatic media fetching. Until a token is
configured, the section links to @drift.retail. If you only want a fixed selection,
individual public post links can be embedded without the automatic feed connection.

Do not paste the token into source code, GitHub, or chat. These variable names must
not start with NEXT_PUBLIC_. The server returns only public media details.

New posts appear automatically while authorization remains valid. Tokens expire or
can be revoked: renew/refresh the long-lived token before expiry using Meta's token
workflow and update the hosting secret. This implementation does not store or rotate
OAuth tokens automatically. If the connection is missing or fails, visitors see the
profile link rather than fabricated posts. No live feed has been verified until the
account owner supplies valid credentials.

Official Meta documentation:
https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login
