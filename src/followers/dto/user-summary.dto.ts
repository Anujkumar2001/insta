import { Expose } from 'class-transformer';

export class UserSummaryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
