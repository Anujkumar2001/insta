import { IsString } from 'class-validator';

export default class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
