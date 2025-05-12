const cognitoConfig = {
  UserPoolId: 'us-east-1_1nRYrH9dW',
  ClientId: '4n8f48rgjjsajma81runlu4nme',
  Domain: 'cloudtripuserpool',
  ClientSecret: '5gcpn05nbgv2u15qbcg5e4acnsvvutgi3hf1t85ijk6i7pr3744',
  Region: 'us-east-1',
  redirectUri: 'https://cloudtrip2.s3.us-east-1.amazonaws.com/index.html'
};

$(document).ready(function() {
  const idToken = localStorage.getItem('id_token');
  console.log('On Load: ID Token:', idToken);
  if (idToken) {
    displayUserInfo(idToken);
    const currentUrl = window.location.origin + window.location.pathname; // משאיר רק את ה-URL הבסיסי
    window.history.replaceState({}, document.title, currentUrl); // מחליף את ה-URL בלי לרענן את הדף
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForTokens(code);
      const currentUrl = window.location.origin + window.location.pathname; // משאיר רק את ה-URL הבסיסי
      window.history.replaceState({}, document.title, currentUrl); // מחליף את ה-URL בלי לרענן את הדף
    } else {
      updateAuthUI(null);
    }
  }
});



function signIn() {
  const url = `https://${cognitoConfig.Domain}.auth.${cognitoConfig.Region}.amazoncognito.com/login?client_id=${cognitoConfig.ClientId}&response_type=code&scope=email+openid+phone&redirect_uri=${cognitoConfig.redirectUri}`;
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
      const username = payload['cognito:username'] || 'User';
      const userGroup = payload["cognito:groups"]
      ? payload["cognito:groups"][0]
      : null;
      updateAuthUI(username,userGroup);
  } catch (error) {
      console.error('Error displaying user info:', error);
      Swal.fire({
        title: "Error!",
        text: "Error displaying user information",
        icon: "error"
      });
  }
}

function updateAuthUI(username,userGroup) {
  const userGreeting = document.getElementById('userGreeting');
  const authButton = document.getElementById('authButton');
  const adminPage = document.getElementById('adminCheck');

  if (username) {
      userGreeting.textContent = `Hello, ${username}`;
      userGreeting.classList.remove('d-none');
      authButton.textContent = 'Sign Out';
      authButton.onclick = signOut;
      authButton.classList.remove('btn-primary');
      authButton.classList.add('btn-danger');
      // Admin-specific logic
      if (userGroup=='Admin') {
        adminPage.classList.remove('d-none'); // Show the Admin Page link
    } else {
        adminPage.classList.add('d-none'); // Hide the Admin Page link
    }
    if (userGroup=='ChefUser') {
      createChef.classList.remove('d-none'); // Show the Admin Page link
  } else {
    createChef.classList.add('d-none'); // Hide the Admin Page link
  }
  } else {
      userGreeting.textContent = '';
      userGreeting.classList.add('d-none');
      authButton.textContent = 'Sign In';
      authButton.onclick = signIn;
      authButton.classList.remove('btn-danger');
      authButton.classList.add('btn-primary');
      adminPage.classList.add('d-none'); // Hide the Admin Page link
      createChef.classList.add('d-none'); // Hide the Admin Page link
    }

  document.getElementById('authContainer').classList.remove('d-none');
}
