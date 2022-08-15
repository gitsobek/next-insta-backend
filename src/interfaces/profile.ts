export interface Story {
  userId: number;
  photoUrl: string;
  createdAt: string;
}

export interface Follower {
  userId: number;
  followedUserId: number;
}

export interface Profile {
  firstName?: string;
  lastName?: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  stories: Story[];
  posts: number;
  followers: number;
  following: number;
  isFollowing: boolean;
}
