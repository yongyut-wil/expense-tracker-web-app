import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const middleware = createMiddleware(routing);

export default function proxy(request: any) {
  return middleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(th|en)/:path*']
};
