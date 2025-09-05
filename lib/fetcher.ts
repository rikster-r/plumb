export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const fetcherWithToken = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.json());
