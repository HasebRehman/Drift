type Media = { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string; timestamp: string };

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!token || (userId && !/^\d+$/.test(userId))) return Response.json({ posts: [], available: false }, { headers });
  try {
    // Instagram can resolve the authenticated account, so a numeric ID is optional.
    const url = new URL(`https://graph.instagram.com/v25.0/${userId || 'me'}/media`);
    url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
    url.searchParams.set('limit', '10');
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Instagram unavailable');
    const data = await response.json() as { data?: Media[] };
    if (!Array.isArray(data.data)) throw new Error('Invalid feed');
    const posts = data.data.filter(item => item.media_url && item.permalink)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 10)
      .map(item => ({ id: item.id, caption: item.caption || '', type: item.media_type, url: item.media_url, thumbnail: item.thumbnail_url, permalink: item.permalink }));
    return Response.json({ posts, available: true }, { headers });
  } catch {
    // Never return upstream errors, request URLs, or private credentials.
    return Response.json({ posts: [], available: false }, { status: 503, headers });
  }
}
