import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty( {
    default: 400
  })
  status: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}
