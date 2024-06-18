import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH_TOKEN = 'refreshToken';

export const RefreshToken = () => SetMetadata(IS_REFRESH_TOKEN, true);
