import { Request, Response } from 'express';

interface FreeApiTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  downloadUrl: string;
  streamUrl: string;
  duration: string;
}

interface FreeApiResponse {
  success: boolean;
  data: FreeApiTrack[];
}

export async function searchMusicTracks(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    // Try multiple free music APIs
    const searchEngines = ['gaama', 'seevn', 'hunjama', 'mtmusic'];
    let allTracks: any[] = [];

    for (const engine of searchEngines) {
      try {
        const apiUrl = `https://musicapi.x007.workers.dev/search?q=${encodeURIComponent(q)}&searchEngine=${engine}`;
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data)) {
            const tracks = data.data.slice(0, 5).map((track: any) => ({
              id: track.id || `${engine}-${Date.now()}-${Math.random()}`,
              name: track.name || track.title || 'Unknown Song',
              artist: track.artist || track.singers || 'Unknown Artist',
              album: track.album || 'Unknown Album',
              preview_url: track.streamUrl || track.downloadUrl || null,
              external_urls: { spotify: track.downloadUrl || '#' },
              image: track.image || null,
              source: engine
            }));
            allTracks = allTracks.concat(tracks);
          }
        }
      } catch (engineError) {
        console.log(`Engine ${engine} failed:`, engineError);
        continue;
      }
    }

    // If no tracks found from free APIs, try iTunes Search API as fallback
    if (allTracks.length === 0) {
      try {
        const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=10`;
        const response = await fetch(itunesUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && Array.isArray(data.results)) {
            allTracks = data.results.map((track: any) => ({
              id: track.trackId?.toString() || `itunes-${Date.now()}-${Math.random()}`,
              name: track.trackName || 'Unknown Song',
              artist: track.artistName || 'Unknown Artist',
              album: track.collectionName || 'Unknown Album',
              preview_url: track.previewUrl || null,
              external_urls: { spotify: track.trackViewUrl || '#' },
              image: track.artworkUrl100 || track.artworkUrl60 || null,
              source: 'itunes'
            }));
          }
        }
      } catch (itunesError) {
        console.log('iTunes API failed:', itunesError);
      }
    }

    // Remove duplicates and limit results
    const uniqueTracks = allTracks.filter((track, index, self) => 
      index === self.findIndex(t => t.name.toLowerCase() === track.name.toLowerCase() && t.artist.toLowerCase() === track.artist.toLowerCase())
    ).slice(0, 20);

    res.json(uniqueTracks);
  } catch (error) {
    console.error('Music search error:', error);
    
    // Final fallback with some example tracks
    const fallbackTracks = [
      {
        id: 'fallback-1',
        name: `Hasil pencarian untuk "${req.query.q}"`,
        artist: 'Tidak ditemukan',
        album: 'Coba kata kunci lain',
        preview_url: null,
        external_urls: { spotify: '#' },
        image: null,
        source: 'fallback'
      }
    ];
    
    res.json(fallbackTracks);
  }
}