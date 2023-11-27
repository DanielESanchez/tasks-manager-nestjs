import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseBadRequest {
  @ApiProperty( {
    default: 400
  })
  status: number;

  @ApiProperty()
  error: string;

  @ApiProperty({
    isArray: true,
    type: "string"
  })
  message: string;
}
