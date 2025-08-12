/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api.response.dto';

export function ApiEnvelopeResponse<T>(
  dto: Type<T>,
  status: HttpStatus = HttpStatus.OK,
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    ApiExtraModels(ApiResponseDto, dto)(target, key, descriptor);

    ApiResponse({
      status,
      schema: {
        type: 'object',
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              statusCode: { type: 'number', example: status },
              data: { $ref: getSchemaPath(dto) },
            },
          },
        ],
      },
    })(target, key, descriptor);
  };
}
