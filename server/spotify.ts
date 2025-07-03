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

    let allTracks: any[] = [];

    // Primary: iTunes Search API (reliable and free)
    try {
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20&country=ID`;
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

    // Secondary: Deezer API (if iTunes fails)
    if (allTracks.length === 0) {
      try {
        const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=15`;
        const response = await fetch(deezerUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            allTracks = data.data.map((track: any) => ({
              id: track.id?.toString() || `deezer-${Date.now()}-${Math.random()}`,
              name: track.title || 'Unknown Song',
              artist: track.artist?.name || 'Unknown Artist',
              album: track.album?.title || 'Unknown Album',
              preview_url: track.preview || null,
              external_urls: { spotify: track.link || '#' },
              image: track.album?.cover_medium || track.album?.cover || null,
              source: 'deezer'
            }));
          }
        }
      } catch (deezerError) {
        console.log('Deezer API failed:', deezerError);
      }
    }

    // Fallback: Local music database with popular Indonesian and international songs
    if (allTracks.length === 0) {
      const localTracks = [
        {
          id: 'local-1',
          name: 'Diam Diam',
          artist: 'Arsy Widianto & Tiara Andini',
          album: 'Diam Diam',
          preview_url: null,
          external_urls: { spotify: '#' },
          image: 'https://i.scdn.co/image/ab67616d0000b273local1',
          source: 'local'
        },
        {
          id: 'local-2',
          name: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          preview_url: null,
          external_urls: { spotify: '#' },
          image: 'https://i.scdn.co/image/ab67616d0000b273local2',
          source: 'local'
        },
        {
          id: 'local-3',
          name: 'Tak Ingin Usai',
          artist: 'Keisya Levronka',
          album: 'Tak Ingin Usai',
          preview_url: null,
          external_urls: { spotify: '#' },
          image: 'https://i.scdn.co/image/ab67616d0000b273local3',
          source: 'local'
        }
      ];

      // Filter local tracks based on query
      allTracks = localTracks.filter(track => 
        track.name.toLowerCase().includes(q.toLowerCase()) ||
        track.artist.toLowerCase().includes(q.toLowerCase()) ||
        track.album.toLowerCase().includes(q.toLowerCase())
      );

      // If no matches in local, show first few as suggestions
      if (allTracks.length === 0) {
        allTracks = localTracks.slice(0, 3).map(track => ({
          ...track,
          name: `${track.name} (Saran untuk "${q}")`,
          id: `suggestion-${track.id}`
        }));
      }
    }

    res.json(allTracks.slice(0, 20));
  } catch (error) {
    console.error('Music search error:', error);
    
    // Final fallback
    const errorTracks = [
      {
        id: 'error-1',
        name: `Pencarian untuk "${req.query.q}"`,
        artist: 'Tidak dapat terhubung ke layanan musik',
        album: 'Coba lagi nanti',
        preview_url: null,
        external_urls: { spotify: '#' },
        image: null,
        source: 'error'
      }
    ];
    
    res.json(errorTracks);
  }
}