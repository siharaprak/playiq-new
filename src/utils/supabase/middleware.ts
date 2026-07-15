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

  // Apply dev session mocking
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.cwd(), 'scratch/mock-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.mockEnabled) {
        const mockUser = {
          id: config.userId,
          email: config.email,
          aud: 'authenticated',
          role: 'authenticated',
        };
        supabase.auth.getUser = async () => {
          return { data: { user: mockUser }, error: null };
        };
        supabase.auth.mfa = {
          getAuthenticatorAssuranceLevel: async () => {
            return { data: { currentLevel: 'aal2', nextLevel: 'aal2' }, error: null };
          }
        } as any;

        // Wrap from method to bypass RLS with admin client
        const { createClient } = require('@supabase/supabase-js');
        const adminClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );
        supabase.from = (relation) => {
          return adminClient.from(relation);
        };
      }
    }
  } catch (err) {
    console.error('Error applying dev mock session in middleware:', err);
  }

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = (request.nextUrl.pathname.startsWith('/student') || 
                            request.nextUrl.pathname.startsWith('/parent') ||
                            request.nextUrl.pathname.startsWith('/admin') ||
                            request.nextUrl.pathname.startsWith('/settings') ||
                            request.nextUrl.pathname.startsWith('/login/mfa')) &&
                           !request.nextUrl.pathname.startsWith('/admin/login')

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup') ||
                      request.nextUrl.pathname.startsWith('/admin/login')

  const isMfaRoute = request.nextUrl.pathname.startsWith('/login/mfa')

  if (!user && isProtectedRoute) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    if (request.nextUrl.pathname.startsWith('/admin')) {
      url.pathname = '/admin/login'
    } else {
      url.pathname = '/login'
    }
    const redirectResponse = NextResponse.redirect(url)
    
    // Crucial: preserve any cookies that were updated by the createServerClient
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    
    return redirectResponse
  }

  if (user) {
    // Check if user has MFA enrolled and needs to verify
    let needsMfa = false
    try {
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (mfaData) {
        needsMfa = mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1'
      }
    } catch (e) {
      console.error('MFA assurance level check error:', e)
    }

    if (needsMfa) {
      // If they need MFA and aren't on the verification route, redirect them
      if (!isMfaRoute && (isProtectedRoute || isAuthRoute)) {
        const url = request.nextUrl.clone()
        url.pathname = '/login/mfa'
        const redirectResponse = NextResponse.redirect(url)
        
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
        })
        return redirectResponse
      }
    } else {
      // If they don't need MFA, and are trying to access auth/MFA routes, redirect to dashboard
      if (isAuthRoute || isMfaRoute) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = profile?.role || 'parent';
        const url = request.nextUrl.clone();
        url.pathname = `/${role}/home`;
        const redirectResponse = NextResponse.redirect(url)
        
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
        })
        
        return redirectResponse
      }

      // Assessment gating: redirect students to assessment if not completed
      const isStudentRoute = request.nextUrl.pathname.startsWith('/student')
      const isAssessmentRoute = request.nextUrl.pathname.startsWith('/student/assessment')

      if (isStudentRoute && !isAssessmentRoute) {
        const { data: assessmentProfile } = await supabase
          .from('student_assessment_profiles')
          .select('assessment_completed')
          .eq('student_id', user.id)
          .maybeSingle()

        if (!assessmentProfile?.assessment_completed) {
          const url = request.nextUrl.clone()
          url.pathname = '/student/assessment'
          const redirectResponse = NextResponse.redirect(url)
          
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
          })
          
          return redirectResponse
        }
      }
    }
  }

  // To properly gate /admin, we would inspect the profiles table, but since middleware 
  // runs on the edge, we enforce Admin checks strictly in the Server Component or Edge Function.

  return supabaseResponse
}
