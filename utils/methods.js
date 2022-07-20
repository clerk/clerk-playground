export const SDK_METHODS = [
  {
    name: 'Session',
    methods: [
      {
        name: 'Clerk.session.id',
        value: () => window.Clerk.session.id
      },
      {
        name: 'Clerk.session.user',
        value: () => window.Clerk.session.user
      },
      {
        name: 'Clerk.session.publicUserData',
        value: () => window.Clerk.session.publicUserData
      },
      {
        name: 'Clerk.session.status',
        value: () => window.Clerk.session.status
      },
      {
        name: 'Clerk.session.abandonAt',
        value: () => window.Clerk.session.abandonAt
      },
      {
        name: 'Clerk.session.expireAt',
        value: () => window.Clerk.session.expireAt
      },
      {
        name: 'Clerk.session.updatedAt',
        value: () => window.Clerk.session.updatedAt
      },
      {
        name: 'Clerk.session.touch()',
        value: () => window.Clerk.session.touch()
      },
      {
        name: 'Clerk.session.getToken()',
        value: () => window.Clerk.session.getToken()
      }
    ]
  },
  {
    name: 'User',
    methods: [
      {
        name: 'Clerk.user.getSessions()',
        value: () => window.Clerk.user.getSessions()
      },
      {
        name: 'Clerk.user.twoFactorEnabled()',
        value: () => window.Clerk.user.twoFactorEnabled()
      },
      {
        name: 'Clerk.user.verifiedExternalAccounts',
        value: () => window.Clerk.user.verifiedExternalAccounts
      },
      {
        name: 'Clerk.user.setProfileImage()',
        value: (...args) => window.Clerk.user.setProfileImage(...args),
        fields: [
          {
            name: 'file',
            type: 'file'
          }
        ]
      },
      {
        name: 'Clerk.user.update()',
        value: (...args) => window.Clerk.user.update(...args),
        fields: [
          {
            name: 'firstName',
            placeholder: 'First name',
            type: 'text'
          },
          {
            name: 'lastName',
            placeholder: 'Last name',
            type: 'text'
          },
          {
            name: 'password',
            placeholder: 'Password',
            type: 'password'
          },
          {
            name: 'unsafeMetadata',
            placeholder: '{ "unsafe": "metadata" }',
            type: 'text'
          }
        ]
      }
    ]
  }
];
