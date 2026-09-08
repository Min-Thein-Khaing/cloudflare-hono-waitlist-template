import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose'

export type AccessAuthBindings = {
  POLICY_AUD?: string
  CF_ACCESS_DOMAIN?: string
  ENVIRONMENT?: string
}

export type AccessAuthVariables = {
  user: JWTPayload & { email?: string }
}

export const accessAuth = createMiddleware<{
  Bindings: AccessAuthBindings
  Variables: AccessAuthVariables
}>(async (c, next) => {
  // Local Development တွင် Cloudflare Access မရှိသဖြင့် Bypass လုပ်ပြီး Mock User ထည့်ပေးခြင်း
  if (c.env.ENVIRONMENT === 'development' || !c.env.ENVIRONMENT) {
    c.set('user', { email: 'dev@localhost.com' })
    return await next()
  }

  // 1. Staging / Production တွင် Environment variables စစ်ဆေးခြင်း
  if (!c.env.POLICY_AUD || !c.env.CF_ACCESS_DOMAIN) {
    return c.json({ error: 'Missing required CF Access environment variables (POLICY_AUD or CF_ACCESS_DOMAIN)' }, 500)
  }

  // 2. CF Access JWT ကို Header သို့မဟုတ် Cookie (CF_Authorization) မှ ရယူခြင်း
  const token = c.req.header('cf-access-jwt-assertion') || getCookie(c, 'CF_Authorization')

  if (!token) {
    return c.json({ error: 'Missing required CF Access JWT (No header or cookie)' }, 403)
  }

  try {
    // 3. JWKS Remote Certs URL ဖန်တီးခြင်း
    const domain = c.env.CF_ACCESS_DOMAIN.replace(/\/$/, '')
    const JWKS = createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`))

    // 4. JWT ကို verify လုပ်ခြင်း
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: domain,
      audience: c.env.POLICY_AUD,
    })

    // 5. User data ကို context ထဲ ထည့်သွင်းပြီး နောက် handler သို့ ဆက်သွားခြင်း
    c.set('user', payload as JWTPayload & { email?: string })
    return await next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ error: `Invalid token: ${message}` }, 403)
  }
})
