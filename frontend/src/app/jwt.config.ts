import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export const jwtConfig = {
  provide: JWT_OPTIONS,
  useValue: {
    tokenGetter: tokenGetter,
    allowedDomains: ['http://localhost:8089/api','http://localhost:8089'],
    //disallowedRoutes: ['http://localhost:8085/user/login'],
  },
};

export const jwtProviders = [
  jwtConfig,
  JwtHelperService
];
