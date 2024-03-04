import { Controller } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { IAccessSignUp, ILogin, ISignUp } from 'src/interface/auth.interface';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @TypedRoute.Post('signup')
  async singUp(@TypedBody() signUpInput: IAccessSignUp & ISignUp) {
    return await this.authService.signUp(
      { 'access-signup': signUpInput['access-signup'] },
      signUpInput,
    );
  }

  @Public()
  @TypedRoute.Post('login')
  async logIn(@TypedBody() input: ILogin) {
    return await this.authService.logIn(input);
  }
}
