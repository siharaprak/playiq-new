import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/student') || 
                           request.nextUrl.pathname.startsWith('/parent') ||
                           request.nextUrl.pathname.startsWith('/admin')

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup')

  if (!user && isProtectedRoute) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // User is logged in, but tries to access login/signup. 
    // We should redirect them to their respective dashboard.
    // NOTE: In Phase 1C, we don't have deep role resolution attached to the JWT 
    // yet for immediate redirecting here cleanly without querying public.profiles.
    // For now, we redirect to a unified entry point, or default to parent.
    // We will do a basic default redirect to /parent/home for now.
    const url = request.nextUrl.clone()
    url.pathname = '/parent/home' // Ideally resolves against profiles.role
    return NextResponse.redirect(url)
  }

  // To properly gate /admin, we would inspect the profiles table, but since middleware 
  // runs on the edge, we enforce Admin checks strictly in the Server Component or Edge Function.

  return supabaseResponse
}
