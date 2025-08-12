/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

interface InternalApiResponse<T> {
  __isApiResponse?: boolean;
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
}

// Predefined default messages by HTTP method
const defaultMessages: Record<string, string> = {
  GET: 'Data fetched successfully',
  POST: 'Created successfully',
  PUT: 'Updated successfully',
  PATCH: 'Updated successfully',
  DELETE: 'Deleted successfully',
};

@Injectable()
export default class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const method = req.method?.toUpperCase() ?? 'GET';

    return next.handle().pipe(
      map((response: unknown) => {
        // If apiResponse() helper used
        if (
          response &&
          typeof response === 'object' &&
          '__isApiResponse' in response
        ) {
          const internalResponse = response as InternalApiResponse<T>;
          const statusCode =
            internalResponse.statusCode ?? res.statusCode ?? HttpStatus.OK;

          return {
            statusCode,
            success: statusCode >= 200 && statusCode < 300,
            message:
              internalResponse.message ??
              defaultMessages[method] ??
              (statusCode < 300 ? 'Success' : 'Error'),
            data: internalResponse.data,
          };
        }

        // Normal data return
        const statusCode = res.statusCode ?? HttpStatus.OK;
        return {
          statusCode,
          success: statusCode >= 200 && statusCode < 300,
          message:
            defaultMessages[method] ?? (statusCode < 300 ? 'Success' : 'Error'),
          data: response as T,
        };
      }),
    );
  }
}
