/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpStatus, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api.response.dto';

export function ApiEnvelopeResponse<T>(
  dto: Type<T>,
  status: HttpStatus = HttpStatus.OK,
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const decorator =
      status === HttpStatus.CREATED ? ApiCreatedResponse : ApiOkResponse;

    decorator({
      schema: {
        type: 'object',
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(dto) },
            },
          },
        ],
      },
    })(target, key, descriptor);
  };
}
