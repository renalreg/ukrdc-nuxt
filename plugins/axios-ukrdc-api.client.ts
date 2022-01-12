import { Context } from '@nuxt/types'
import { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'
import { isAbsolute, urljoin } from '~/helpers/utils/pathUtils'

/* 
TEMPORARY REDEFINITION OF NuxtAxiosInstance TYPE
See https://github.com/nuxt-community/axios-module/issues/555

Interface NuxtAxiosInstance is no longer exported by nuxt-axios,
so we need to redefine it here. This should only be temporary, 
eventually replaced with:

import { NuxtAxiosInstance } from '@nuxtjs/axios'
*/

interface NuxtAxiosInstance extends AxiosStatic {
  $request<T = any>(config: AxiosRequestConfig): Promise<T>
  $get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  $delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  $head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  $options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  $post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  $put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  $patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>

  setBaseURL(baseURL: string): void
  setHeader(name: string, value?: string | false, scopes?: string | string[]): void
  setToken(token: string | false, type?: string, scopes?: string | string[]): void

  onRequest(callback: (config: AxiosRequestConfig) => void | AxiosRequestConfig | Promise<AxiosRequestConfig>): void
  onResponse<T = any>(
    callback: (response: AxiosResponse<T>) => void | AxiosResponse<T> | Promise<AxiosResponse<T>>
  ): void
  onError(callback: (error: AxiosError) => any): void
  onRequestError(callback: (error: AxiosError) => any): void
  onResponseError(callback: (error: AxiosError) => any): void

  create(options?: AxiosRequestConfig): NuxtAxiosInstance
}

// Add our injected $api into the Vue instance and context interfaces

declare module 'vue/types/vue' {
  interface Vue {
    $api: NuxtAxiosInstance
  }
}

declare module '@nuxt/types' {
  interface Context {
    $api: NuxtAxiosInstance
  }
}

// Create a new Axios instance and inject it into the Vue instance and context

export default function ({ $axios, $okta, $config }: Context, inject: Function) {
  console.log({ $axios, $okta })
  // Create a custom axios instance
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json',
      },
    },
  })

  // If we're overriding the API host (e.g. for running the API locally
  // on a different port or server) then we need to set the baseURL to
  // the new host so that all request URLs are prefixed by the new host.
  // NB: This is only really relevant for local development, in production
  // the user-facing app and API run on the same host and port.
  if ($config.api.host) {
    api.setBaseURL($config.api.host)
  }

  // Request interceptor to handle API base paths and authentication
  api.interceptors.request.use((config) => {
    // Add the API base (if not already present) from all non-absolute URLs
    if (config.url) {
      // URLs returned by the API hypermedia include the base URL already,
      // so we don't need to add it again.
      // Likewise, we assume any absolute URLs are already correct.
      if (!isAbsolute(config.url) && !config.url.startsWith($config.api.base)) {
        config.url = urljoin($config.api.base, config.url)
      }
    }

    // Add the authorization header to each request
    const token = $okta.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  // Inject to context as $api
  inject('api', api)
}
