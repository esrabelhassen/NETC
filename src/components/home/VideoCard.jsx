import { useEffect, useState } from 'react';
import { Play, Video } from 'lucide-react';
import GlassCard from '../GlassCard';

const YOUTUBE_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/;

const getYouTubeId = (url = '') => (url.match(YOUTUBE_REGEX)?.[1] ?? '');
const getVideoUrl = (video = {}) => video?.url || video?.video_url || video?.link || video?.src || '';
const hasYouTube = (video) => Boolean(getYouTubeId(getVideoUrl(video)));
const getEmbedUrl = (video) => {
  const url = getVideoUrl(video);
  const youtubeId = getYouTubeId(url);
  if (!youtubeId) return url;
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1`;
};

const VideoCard = ({ videos = [], t = (key) => key }) => {
  const [featured, setFeatured] = useState(videos.length ? videos[0] : null);

  useEffect(() => {
    setFeatured(videos.length ? videos[0] : null);
  }, [videos]);

  const handleSelect = (video) => {
    setFeatured(video);
  };

  return (
    <GlassCard className="flex flex-col gap-4 p-6 max-w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{t('home.videoCard.title')}</h3>
        <span className="text-xs font-semibold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
          {videos.length}
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-2xl bg-slate-950/80 aspect-video flex items-center justify-center">
        {featured ? (
          hasYouTube(featured) ? (
            <iframe
              src={getEmbedUrl(featured)}
              title={featured.title || 'Featured video'}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video
              src={getVideoUrl(featured)}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-center text-orange-200">
            <Video className="h-12 w-12 text-orange-400" />
            <p className="text-sm text-orange-300/80">{t('home.videoCard.empty')}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto divide-y divide-border/40">
        {videos.map((video, index) => {
          const youtubeId = getYouTubeId(getVideoUrl(video));
          const isActive = featured?.id && video.id && featured.id === video.id;
          return (
            <button
              key={video.id || video.url || index}
              type="button"
              onClick={() => handleSelect(video)}
              className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-xl transition-colors ${
                isActive ? 'bg-accent/20 border border-accent/40' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900/70 flex items-center justify-center">
                {youtubeId ? (
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                    alt={video.title || 'Video thumbnail'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Play className="h-5 w-5 text-orange-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{video.title || 'Untitled'}</p>
                <p className="text-xs text-gray-400 truncate">{video.description || t('home.videoCard.overview')}</p>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default VideoCard;
