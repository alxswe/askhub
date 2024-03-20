import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSessionStorage } from "usehooks-ts";
import { httpClient } from ".";

export function useAxiosResponse(
  timeout?: number,
): [
  Response | AxiosResponse<any, any> | null,
  Dispatch<SetStateAction<Response | AxiosResponse<any, any> | null>>,
] {
  const [response, setResponse] = useState<
    Response | AxiosResponse<any, any> | null
  >(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const changeResponse = () => setResponse(null);
    intervalId = setInterval(changeResponse, timeout ?? 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [response, timeout]);

  return [response, setResponse];
}

type useAxiosProps<T> = {
  loading: boolean;
  data: T | null;
  setData: Dispatch<SetStateAction<T | null>>;
  error: Response | AxiosResponse<any, any> | null;
};

export function useAxios<T = any>(
  path: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): useAxiosProps<T> {
  const router = useRouter();
  const { headers } = useNextHeaders();
  const [isMounted, setMounted] = useSessionStorage("page-mount", false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useAxiosResponse();

  const fetcher = useCallback(() => {
    const controller = new AbortController();
    !isMounted && setLoading((_) => true);
    httpClient
      // @ts-expect-error: path wrong type
      .get<T>(path, params, {
        ...config,
        headers: { ...headers, ...config?.headers },
        signal: controller.signal,
      })
      .then((res) => setData(res.data))
      .catch(({ response }) => setError(response))
      .finally(() => !isMounted && setLoading((_) => false));

    return () => {
      controller.abort();
    };
  }, [isMounted, path, params, config, headers, setError]);

  useEffect(() => {
    if (router.isReady) {
      fetcher();
    }

    return () => {};
  }, [fetcher, router.isReady]);

  return { loading, data, setData, error };
}

export function useNextHeaders() {
  const router = useRouter();
  const { data: session } = useSession();

  const headers = useMemo(() => {
    const headers: AxiosRequestConfig["headers"] = {
      "Accept-Language": router.locale,
    };

    if (session?.user) {
      headers["Authorization"] = "Token " + session?.user;
    }

    return headers;
  }, [router.locale, session?.user]);

  return { headers };
}
