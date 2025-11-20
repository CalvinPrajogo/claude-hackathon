export interface SocialEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  tags: string[];
  pregameCount: number;
  friendsGoing: number;
  description?: string;
  category: 'Party' | 'Bar/Club' | 'Game' | 'Concert' | 'House Event';
}

export interface Pregame {
  id: string;
  eventId: string;
  title: string;
  host: Host;
  location: string;
  time: string;
  capacity: number;
  currentAttendees: number;
  mutualFriends: Friend[];
  status: 'open' | 'request-only' | 'full';
  description?: string;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  year: string;
  major: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualCount?: number;
}
