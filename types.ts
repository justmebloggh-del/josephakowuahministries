
export interface Sermon {
  id: string;
  title: string;
  apostle: string;
  date: string;
  serviceType: string;
  topic: string;
  series: string;
  duration: string;
  description: string;
  thumbnail: string;
  audioUrl: string;
  featured: boolean;
  plays: number;
  downloads: number;
  dateAdded: string;
}

export const SERMONS_KEY = 'bbc_sermons';
export const LISTEN_LATER_KEY = 'bbc_listen_later';

export interface PrayerRequest {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
