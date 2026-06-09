import { NextRequest, NextResponse } from "next/server"


const PUBLIC_ROUTES : string[] = ['/login','/register']
const PATIENT_ONLY_ROUTES : string[] = ['/book','/doctors']


// Define what properties we guarantee will be inside our decrypted token
interface DecodedTokenClaims {
  user_id: number;
  role: "patient" | "doctor";
  exp: number; // Expiration timestamp from Go jwt.RegisteredClaims
}

// A lightweight helper to extract JWT claims on the Edge Runtime
function parseJwtPayload(token: string): DecodedTokenClaims|null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64); // Decodes Base64 string
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null; // Token is malformed
  }
}

export function middleware (request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const {pathname} = request.nextUrl

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isPatientRoute = PATIENT_ONLY_ROUTES.includes(pathname)

    if (!token) {
        if (isPublicRoute) {
            return NextResponse.next()
        }

        return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = parseJwtPayload(token)
    const userRole = payload?.role

    if (isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (userRole == "doctor") {
        if (isPatientRoute){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        
    }

    return NextResponse.next()


}

export const config = {
    matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (Go backend handles api auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
