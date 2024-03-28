interface ICommunity {
  id: string;
  name: string;
  description: string;
  members: String[];
  createdById: string;
  createdBy: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface IQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  content: string;
  createdById: string;
  createdBy?: Record<string, any>;
  communityId: string;
  community?: Record<string, any>;
  seen: number[];
  likes: String[];
  upvotes: String[];
  downvotes: String[];
  _count: {
    likes: number;
    comments: number;
  };
  is_liked: boolean;
  is_author: boolean;
}

interface IComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  createdById: string;
  createdBy?: Record<string, any>;
  communityId: string;
  community?: Record<string, any>;
  questionId: string;
  question?: Record<string, any>;
}
