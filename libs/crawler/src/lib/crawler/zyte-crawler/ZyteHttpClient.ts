import {
  BaseHttpClient,
  HttpRequest,
  HttpResponse,
  ResponseTypes,
  StreamingHttpResponse,
} from '@crawlee/core';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { BaseHttpResponseData } from '@crawlee/core/http_clients/base-http-client';
import { Readable } from 'node:stream';
import { createLogger } from '@universal-scrapper/logger';

export class ZyteHttpClient implements BaseHttpClient {
  private readonly logger = createLogger('ZyteHttpClient');
  constructor(private readonly zyteApiKey: string) {}

  public async sendRequest<TResponseType extends keyof ResponseTypes = 'text'>(
    request: HttpRequest<TResponseType>
  ): Promise<HttpResponse<TResponseType>> {
    const redirectUrls: Array<URL> = [];

    let resultUrl: string | undefined;
    let resultStatusCode: number | undefined;

    this.logger.debug(`send "${request.url}" request through Zyte`);

    const response = await axios.request({
      ...request,
      url: 'https://api.zyte.com/v1/extract',
      method: 'POST',
      headers: {
        ...(request.headers ?? {}),
        Authorization: `Basic ${Buffer.from(`${this.zyteApiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        url: request.url,
        browserHtml: true,
      }),
      transformResponse: (data) => {
        const { browserHtml, url, statusCode } = JSON.parse(data);
        resultUrl = url;
        resultStatusCode = statusCode;
        return browserHtml;
      },
      timeout:
        request.timeout === undefined
          ? undefined
          : 'request' in request.timeout
          ? request.timeout.request
          : 'response' in request.timeout
          ? request.timeout.response
          : undefined,
      responseType: 'json',
      beforeRedirect: (options: Record<string, any>) => {
        if (options['url']) {
          redirectUrls.push(new URL(options['url']));
        }
      },
    });

    this.logger.debug(
      `"${response.data.length}" length html string received from Zyte for "${
        resultUrl ?? String(request.url)
      }" page`
    );

    return {
      complete: true,
      request,
      url: resultUrl ?? String(request.url),
      statusCode: resultStatusCode ?? response.status,
      redirectUrls,
      headers: this.normalizeHeaders(response),
      trailers: {}, // ADHOC: not supported by axios
      ip: undefined,
      body: response.data,
    };
  }

  private normalizeHeaders(response: AxiosResponse): BaseHttpResponseData['headers'] {
    const rawHeaders =
      response.headers instanceof AxiosHeaders ? response.headers.toJSON() : response.headers;
    return Object.entries(rawHeaders).reduce(
      (result, [key, value]) => {
        if (key.toLowerCase() === 'content-type') {
          return result;
        }
        if (value === null || value === undefined) {
          result[key] = undefined;
        }
        result[key] = String(value);
        return result;
      },
      { 'content-type': 'text/html' } as BaseHttpResponseData['headers']
    );
  }

  public async stream(request: HttpRequest): Promise<StreamingHttpResponse> {
    const fetchResponse = await this.sendRequest(request);

    const reader = Readable.from(fetchResponse.body);

    const totalByteLength = Buffer.from(fetchResponse.body).byteLength;
    let bytesRead = Buffer.from(fetchResponse.body).byteLength;
    reader.on('data', (chunk) => (bytesRead += Buffer.from(chunk).byteLength));

    return {
      ...fetchResponse,
      complete: false,
      stream: Readable.from(fetchResponse.body),
      get downloadProgress() {
        return { percent: (100 * bytesRead) / totalByteLength, transferred: bytesRead };
      },
      get uploadProgress() {
        return { percent: 0, transferred: 0 };
      },
    };
  }
}
