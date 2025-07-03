import { Request, Response } from 'express';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url?: string;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.status}`);
  }

  const data: SpotifyTokenResponse = await response.json();
  
  // Cache the token
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000 // Subtract 60 seconds for safety
  };

  return data.access_token;
}

export async function searchSpotifyTracks(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const token = await getSpotifyToken();
    
    const searchUrl = new URL('https://api.spotify.com/v1/search');
    searchUrl.searchParams.append('q', q);
    searchUrl.searchParams.append('type', 'track');
    searchUrl.searchParams.append('limit', '20');
    searchUrl.searchParams.append('market', 'ID'); // Indonesia market

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status}`);
    }

    const data: SpotifySearchResponse = await response.json();

    // Transform Spotify data to our format
    const tracks = data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      image: track.album.images[0]?.url || null
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Spotify search error:', error);
    
    // Fallback to mock data if Spotify fails
    const mockTracks = [
      {
        id: 'mock-1',
        name: `Results for "${req.query.q}"`,
        artist: 'Mock Artist',
        album: 'Mock Album',
        preview_url: null,
        external_urls: { spotify: '#' },
        image: null
      }
    ];
    
    res.json(mockTracks);
  }
}