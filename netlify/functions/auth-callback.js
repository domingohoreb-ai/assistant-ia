exports.handler = async function(event, context) {
  const CLIENT_ID = '444306649961-4kvclk4hetli1a3nqa5qniu0puat39a0.apps.googleusercontent.com';
  const CLIENT_SECRET = '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';
  const REDIRECT_URI = 'https://magenta-cobbler-cc608f.netlify.app/.netlify/functions/auth-callback';

  const code = event.queryStringParameters?.code;
  if (!code) {
    return { statusCode: 400, body: 'Code manquant' };
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
        <body style="background:#0a0a0f;color:#fff;font-family:sans-serif;text-align:center;padding:40px">
          <h2>✅ Connexion Google réussie !</h2>
          <p>Ferme cette fenêtre et retourne sur Aria</p>
          <script>
            localStorage.setItem('aria_google_token', '${tokens.access_token}');
            localStorage.setItem('aria_google_refresh', '${tokens.refresh_token || ''}');
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
        </html>
      `
    };
  } catch(e) {
    return { statusCode: 500, body: 'Erreur: ' + e.message };
  }
};
