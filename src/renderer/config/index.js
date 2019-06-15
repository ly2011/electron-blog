export const clientID = 'c2d563e987037c8b047d'
export const clientSecret = 'cb30095720bf40de26e32218ccde9dca52dfd2ee'
export const authorizeUri = 'https://github.com/login/oauth/authorize'
export const redirectUri = 'http://localhost:3000/oauthredirect'
export const githubLoginUrl = `${authorizeUri}?client_id=${clientID}&redirect_uri=${redirectUri}`
