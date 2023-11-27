import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto {

    @ApiProperty({
        description: 'Email of user to login',
        required: true
      })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user, must includes a uppercase, lowercase and number',
        minimum: 6,
        maximum: 50,
        required: true
      })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}