export const FLOW_LINKS = [
  {
    name: 'Sign up with magic link',
    strategy: 'email_link',
    path: '/sign-up'
  },
  {
    name: 'Sign up with password',
    strategy: 'password',
    path: '/sign-up/password'
  },
  {
    name: 'Sign up with passcode',
    strategy: 'email_code',
    path: '/sign-up/passcode'
  },
  {
    name: 'Sign up with social',
    strategy: 'oauth',
    path: '/sign-up/social'
  }
];

export const FEATURE_LINKS = [
  {
    name: 'Home',
    label: 'Home',
    path: '/'
  },
  {
    name: 'Passwords',
    label: 'Password',
    strategy: 'password',
    path: '/passwords'
  },
  {
    name: 'One-Time Passcodes (OTP)',
    label: 'One-Time Passcode',
    strategy: 'email_code',
    path: '/otp'
  },
  {
    name: 'Magic Links',
    label: 'Email Magic Link',
    strategy: 'email_link',
    path: '/magic-links'
  },
  {
    name: 'OAuth Social Providers',
    label: 'OAuth Social Provider',
    strategy: 'oauth',
    path: '/oauth'
  },
  {
    name: 'Multifactor Auth (MFA)',
    path: '/mfa'
  },
  {
    name: 'Forgot Password',
    label: 'Forgot Password',
    strategy: 'forgot_password',
    path: '/forgot-password'
  },
  {
    name: 'Metadata',
    path: '/metadata'
  },
  {
    name: 'User Profile',
    path: '/user-profile'
  }
];

export const OAUTH_PROVIDERS = [
  {
    name: 'Google',
    strategy: 'oauth_google'
  },
  {
    name: 'GitHub',
    strategy: 'oauth_github'
  },
  {
    name: 'Twitter',
    strategy: 'oauth_twitter'
  }
];
