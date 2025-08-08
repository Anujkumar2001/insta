import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Data fetched successfully' })
  message: string;

  @ApiProperty()
  data: T;
}
