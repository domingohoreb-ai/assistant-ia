exports.handler = async function(event, context) {
  const CLIENT_ID = '444306649961-4kvclk4hetli1a3nqa5qniu0puat39a0.apps.googleusercontent.com';
  const CLIENT_SECRET = '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';
  const REDIRECT_URI = 'https://magenta-cobbler-cc608f.netlify.app/.netlify/functions/auth-callback';

  const code = event.queryStringParameters && event.queryStringParameters.code;

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
      }).toString()
    });

    const tokens = await response.json();

    if (!tokens.access_token) {
      return {
        statusCode: 400,
        body: 'Erreur token: ' + JSON.stringify(tokens)
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>ARIA — Connexion réussie</title></head>
<body style="background:#080810;color:#fff;font-family:sans-serif;text-align:center;padding:60px 20px;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center">
  <div style="font-size:60px;margin-bottom:20px">✅</div>
  <h2 style="font-size:24px;font-weight:800;margin-bottom:10px">Gmail connecté !</h2>
  <p style="color:rgba(255,255,255,.5);margin-bottom:30px">Retournez sur ARIA pour accéder à vos emails.</p>
  <p style="color:rgba(255,255,255,.3);font-size:13px">Cette fenêtre se ferme dans 3 secondes...</p>
  <script>
    try {
      localStorage.setItem('aria_gtoken', '${tokens.access_token}');
      if('${tokens.refresh_token}') localStorage.setItem('aria_grefresh', '${tokens.refresh_token}');
    } catch(e) {}
    setTimeout(function() { window.close(); }, 3000);
  </script>
</body>
</html>`
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Erreur serveur: ' + e.message
    };
  }
};
