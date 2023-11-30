import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtPayload, ValidRoles } from "./interfaces";

@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}

  /**
   *
   * @param createUserDto information of user to create
   * @returns object with jwt token
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  /**
   *
   * @returns string if admin created
   */
  async createAdmin(): Promise<string> {
    try {
      const admin = new User();
      admin.email = "admin@admin.adm";
      admin.password = bcrypt.hashSync("Admin1234", 10);
      admin.fullName = "Admin";
      admin.roles = [ValidRoles.admin, ValidRoles.user];
      await this.userRepository.save(admin);
      return "Admin created";
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  /**
   *
   * @param loginUserDto login information of user
   * @returns object with jwt token
   */
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException("Credentials are not valid (email)");

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException("Credentials are not valid (password)");

    return {
      token: this.getJwtToken({ id: user.id }),
    };
  }

  /**
   *
   * @param payload payload data to sign the token
   * @returns jwt token
   */
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /**
   *
   * @param error error to handle
   */
  private handleDBErrors(error: any): never {
    if (error.code === "23505") throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(error.detail);
  }
}
