const laravelApiBaseUrl = process.env.LARAVEL_API_BASE_URL?.replace(/\/$/, "");

type ApiQueryValue = string | string[] | undefined;

export interface ApiRequestLike {
  method?: string;
  query?: Record<string, ApiQueryValue>;
  body?: unknown;
}

export interface ApiResponseLike {
  status: (code: number) => ApiResponseLike;
  json: (body: unknown) => void;
  send: (body: string) => void;
  end: () => void;
}

function getForwardHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (process.env.LARAVEL_INTERNAL_TOKEN) {
    headers["X-Internal-Token"] = process.env.LARAVEL_INTERNAL_TOKEN;
  }

  return headers;
}

export async function proxyLaravelRequest(req: ApiRequestLike, res: ApiResponseLike, path: string) {
  if (!laravelApiBaseUrl) {
    return false;
  }

  const targetUrl = new URL(path, `${laravelApiBaseUrl}/`);

  Object.entries(req.query ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => targetUrl.searchParams.append(key, String(item)));
      return;
    }

    if (value !== undefined) {
      targetUrl.searchParams.set(key, String(value));
    }
  });

  const hasBody = !["GET", "HEAD"].includes(req.method ?? "GET");
  const response = await fetch(targetUrl.toString(), {
    method: req.method ?? "GET",
    headers: {
      ...getForwardHeaders(),
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
  });

  const text = await response.text();
  res.status(response.status);

  if (!text) {
    res.end();
    return true;
  }

  try {
    res.json(JSON.parse(text));
  } catch {
    res.send(text);
  }

  return true;
}
