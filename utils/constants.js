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
    name: 'One-Time Passcodes',
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
    path: '/oauth'
  },
  {
    name: 'Multifactor Auth (MFA)',
    path: '/mfa'
  },
  {
    name: 'User Profile',
    path: '/user-profile'
  }
];
