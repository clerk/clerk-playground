import { useUser } from '@clerk/nextjs';

const OAuthPage = () => {
  return <SignInOAuthButtons />;
};

function SignInOAuthButtons() {
  const { user } = useUser();

  const connectAccount = (strategy, redirect) => {
    return user.createExternalAccount({
      strategy: strategy,
      redirect_url: redirect
    });
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app
  return (
    <div>
      <button
        onClick={() =>
          connectAccount(
            'oauth_google',
            'https://accounts.google.com/o/oauth2/auth?access_type=offline\u0026client_id=787459168867-0v2orf3qo56uocsi84iroseoahhuovdm.apps.googleusercontent.com\u0026redirect_uri=https%3A%2F%2Fclerk.shared.lcl.dev%2Fv1%2Foauth_callback\u0026response_type=code\u0026scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile\u0026state=3fiiezr0csj4n9pon1vlc8wciloathzqbpvbhycp'
          )
        }
      >
        Sign in with Google
      </button>
      <button
        onClick={() =>
          connectAccount(
            'oauth_github',
            'https://github.com/login/oauth/authorize?access_type=offline\u0026client_id=456274a3f3e4821d16e4\u0026redirect_uri=https%3A%2F%2Fclerk.shared.lcl.dev%2Fv1%2Foauth_callback\u0026response_type=code\u0026scope=user%3Aemail+read%3Auser\u0026state=vts9v12xtqh14n7ts47drv22oevlsedexb2c24lp'
          )
        }
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() =>
          connectAccount(
            'oauth_twitter',
            'https://api.twitter.com/oauth/authenticate?oauth_token=X00dJwAAAAABVq9hAAABgZFAH9k'
          )
        }
      >
        Sign in with Twitter
      </button>
    </div>
  );
}

export default OAuthPage;
