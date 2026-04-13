exports.handler = async function(event, context) {
  const CLIENT_ID = '444306649961-4kvclk4hetli1a3nqa5qniu0puat39a0.apps.googleusercontent.com';
  const REDIRECT_URI = 'https://magenta-cobbler-cc608f.netlify.app/.netlify/functions/auth-callback';
  
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;

  return {
    statusCode: 302,
    headers: { Location: authUrl }
  };
};
