export const loadCommunity = async (communityId: string) => {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/communities/" + communityId,
    {
      credentials: "include",
    },
  );
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return null;
};

export const loadQuestion = async (questionId: string) => {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/questions/" + questionId,
    {
      credentials: "include",
    },
  );
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return null;
};

export const loadUser = async (userId: string) => {
  const res = await fetch(process.env.NEXTAUTH_URL + "/api/users/" + userId, {
    credentials: "include",
  });
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return null;
};

export const loadQuestionLikes = async (questionId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set("questionId", questionId);
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/likes?" + searchParams,
    {
      credentials: "include",
    },
  );
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return [];
};

export const LoadQuestionCounter = async (questionId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set("id", questionId);
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/questions/count?" + searchParams,
    {
      credentials: "include",
    },
  );
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return {};
};

export const loadCommunities = async (params: any = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.set(key, params[key]);
  });
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/communities?" + searchParams,
    {
      credentials: "include",
    },
  );
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return [];
};

export async function loadPopularQuestions() {
  const res = await fetch(process.env.NEXTAUTH_URL + "/api/questions/popular", {
    credentials: "include",
  });
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return [];
}

export async function loadTrendingQuestions() {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/questions/trending",
    {
      credentials: "include",
    },
  );
  if (res.ok) {
    const dt = await res.json();
    return dt;
  }

  return [];
}
