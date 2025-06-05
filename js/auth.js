const cognitoConfig = {
  UserPoolId: 'us-east-1_JRC490st7'	,
  ClientId: '6pk04s75djbfe9ajrboae9o5jq',
  Domain: 'cloudtripuserpool',
  ClientSecret: '5gcpn05nbgv2u15qbcg5e4acnsvvutgi3hf1t85ijk6i7pr3744',
  Region: 'us-east-1',
  redirectUri: 'https://cloudtrip3.s3.us-east-1.amazonaws.com/index.html'
};

document.addEventListener('DOMContentLoaded', function () {
  const idToken = localStorage.getItem('id_token');
  console.log('On Load: ID Token:', idToken);
  if (idToken) {
    displayUserInfo(idToken);
    const currentUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, currentUrl);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForTokens(code);
      const currentUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, currentUrl);
    } else {
      updateAuthUI(null);
    }
  }
});

function signUp() {
  const url = `https://${cognitoConfig.Domain}.auth.${cognitoConfig.Region}.amazoncognito.com/signup?client_id=${cognitoConfig.ClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${cognitoConfig.redirectUri}`;
  window.location.href = url;
}

function signIn() {
  const url = `https://${cognitoConfig.Domain}.auth.${cognitoConfig.Region}.amazoncognito.com/login?client_id=${cognitoConfig.ClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${cognitoConfig.redirectUri}`;
  window.location.href = url;
}

function signOut() {
  const url = `https://${cognitoConfig.Domain}.auth.${cognitoConfig.Region}.amazoncognito.com/logout?client_id=${cognitoConfig.ClientId}&logout_uri=${encodeURIComponent(cognitoConfig.redirectUri)}`;
  localStorage.removeItem('id_token');
  window.location.href = url;
}

async function exchangeCodeForTokens(code) {
  const tokenEndpoint = `https://${cognitoConfig.Domain}.auth.${cognitoConfig.Region}.amazoncognito.com/oauth2/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', cognitoConfig.ClientId);
  params.append('client_secret', cognitoConfig.ClientSecret);
  params.append('code', code);
  params.append('redirect_uri', cognitoConfig.redirectUri);

  try {
      const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.id_token) {
          console.log('ID Token:', data.id_token);
          localStorage.setItem('id_token', data.id_token);
          displayUserInfo(data.id_token);
      } else {
          console.error('No ID token received');
      }
  } catch (error) {
      console.error('Error exchanging code for tokens:', error);     
       Swal.fire({
        title: "Error!",
        text: "Failed to sign in. Please try again.",
        icon: "error"
      });
  }
}

function displayUserInfo(idToken) {
  try {
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    console.log('User Info:', payload);

    // בנה שם מלא מהשדות name ו־family_name
    const fullName = `${payload.name || ''} ${payload.family_name || ''}`.trim();
    const email = payload.email;
    const userGroup = payload["cognito:groups"]
      ? payload["cognito:groups"][0]
      : null;

    // שמור את המייל בלוקאל סטורג'
    localStorage.setItem('userEmail', email);

    // עדכן את ה־UI עם שם מלא
    updateAuthUI(fullName, userGroup);

    // סנכרן את המשתמש לדיינמונדבי
    syncUserToDynamo(fullName, email);

  } catch (error) {
    console.error('Error displaying user info:', error);
    Swal.fire({
      title: "Error!",
      text: "Error displaying user information",
      icon: "error"
    });
  }
}



async function syncUserToDynamo(fullName, email) {
  try {
    const response = await fetch('https://ebadnoasn0.execute-api.us-east-1.amazonaws.com/prod/syncUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email })
    });

    if (!response.ok) throw new Error('Sync failed');
    console.log('User synced to DynamoDB');
  } catch (err) {
    console.error('Error syncing user:', err);
  }
}


function updateAuthUI(username, userGroup) {
  const userGreeting = document.getElementById('userGreeting');
  const authButton = document.getElementById('authButton');
  const adminPage = document.getElementById('adminCheck');
  const authContainer = document.getElementById('authContainer');
  const signUpButton = document.querySelector('.btn-signup');

  if (!userGreeting || !authButton || !adminPage || !authContainer || !signUpButton) {
    console.log("⏸️ UI update skipped — elements not found in DOM");
    return;
  }

  if (username) {
    userGreeting.textContent = `Hello, ${username}`;
    userGreeting.classList.remove('d-none');

    authButton.textContent = 'Sign Out';
    authButton.onclick = signOut;
    authButton.classList.remove('btn-login');
    authButton.classList.add('btn-danger');

    signUpButton.style.display = 'none'; // Hide sign-up

    adminPage.classList.toggle('d-none', userGroup !== 'Admin');
  } else {
    userGreeting.textContent = '';
    userGreeting.classList.add('d-none');

    authButton.textContent = 'Login';
    authButton.onclick = signIn;
    authButton.classList.remove('btn-danger');
    authButton.classList.add('btn-login');

    signUpButton.style.display = 'inline-block'; // Show sign-up

    adminPage.classList.add('d-none');
  }

  authContainer.classList.remove('d-none');
}


