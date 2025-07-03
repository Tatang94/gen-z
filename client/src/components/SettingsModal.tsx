import { useState, useEffect } from 'react';
import { X, Check, Globe, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppSettings {
  language: string;
  mediaQuality: string;
  autoplayVideos: boolean;
  useDataSaver: boolean;
  soundEnabled: boolean;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'id',
    mediaQuality: 'high',
    autoplayVideos: true,
    useDataSaver: false,
    soundEnabled: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Apply settings globally
    applySettingsGlobally(settings);
  }, [settings]);

  const applySettingsGlobally = (newSettings: AppSettings) => {
    // Apply data saver mode
    if (newSettings.useDataSaver) {
      document.documentElement.classList.add('data-saver-mode');
    } else {
      document.documentElement.classList.remove('data-saver-mode');
    }

    // Apply media quality CSS variables
    document.documentElement.style.setProperty('--media-quality', newSettings.mediaQuality);
    
    // Apply sound settings
    const audioElements = document.querySelectorAll('audio, video');
    audioElements.forEach((element) => {
      (element as HTMLMediaElement).muted = !newSettings.soundEnabled;
    });

    // Apply autoplay settings
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach((element) => {
      if (newSettings.autoplayVideos) {
        element.setAttribute('autoplay', '');
      } else {
        element.removeAttribute('autoplay');
      }
    });
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ms', name: 'Bahasa Malaysia', flag: '🇲🇾' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  const mediaQualities = [
    { value: 'low', label: 'Rendah (Hemat Data)', description: 'Kualitas gambar dan video rendah' },
    { value: 'medium', label: 'Sedang', description: 'Kualitas standar, hemat baterai' },
    { value: 'high', label: 'Tinggi', description: 'Kualitas terbaik, konsumsi data tinggi' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengaturan Umum</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Language Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <Globe size={20} />
              <span>Bahasa</span>
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => updateSetting('language', lang.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    settings.language === lang.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{lang.name}</span>
                  </div>
                  {settings.language === lang.code && (
                    <Check size={20} className="text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Media Quality */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Kualitas Media</h3>
            <div className="space-y-2">
              {mediaQualities.map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => updateSetting('mediaQuality', quality.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    settings.mediaQuality === quality.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{quality.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{quality.description}</div>
                    </div>
                    {settings.mediaQuality === quality.value && (
                      <Check size={20} className="text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Settings */}
          <div className="space-y-4">
            {/* Autoplay Videos */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Autoplay Video</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Video akan diputar otomatis saat muncul di feed</p>
              </div>
              <button
                onClick={() => updateSetting('autoplayVideos', !settings.autoplayVideos)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.autoplayVideos ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoplayVideos ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Suara</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aktifkan suara untuk video dan notifikasi</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Data Saver */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.useDataSaver ? <WifiOff size={20} /> : <Wifi size={20} />}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Mode Hemat Data</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kurangi penggunaan data dengan membatasi media</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('useDataSaver', !settings.useDataSaver)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.useDataSaver ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.useDataSaver ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}