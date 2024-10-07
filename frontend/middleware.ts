import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Retrieve token from cookies
  const token = request.cookies.get('token')?.value;

  console.log(token);

  // Redirect to login page if the user is not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to match certain paths
export const config = {
  matcher: ['/home/:path*', '/', '/profile/:path*'],  // Add your protected routes here
};
