import { apiUrl } from "./api-url";

export const defaultLimit = 10;
export const defaultOffset = 0;

export const buildPaginatedUrl = (
  path: string,
  limit: string | string[] | undefined,
  offset: string | string[] | undefined
) => {
  const url = new URL(path, apiUrl);
  const Limit = limit ? parseInt(String(limit)) : defaultLimit;
  const Offset = offset ? parseInt(String(offset)) : defaultOffset;
  const params: { [key: string]: number } = { Limit, Offset };
  for (const key in params) {
    url.searchParams.append(key, params[key].toString());
  }
  return url;
};

export const getPaginatedScores = async (
  path: string,
  limit: string | string[] | undefined,
  offset: string | string[] | undefined
) => {
  const url = buildPaginatedUrl(path, limit, offset);
  console.log({ url });
  try {
    const result = await fetch(url);
    if (result.ok) {
      return await result.json();
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
