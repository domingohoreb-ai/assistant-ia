exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { token, action, title, start, end, description } = JSON.parse(event.body);

    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Token manquant' }) };
    }

    let result;

    if (action === 'list') {
      const now = new Date().toISOString();
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10&singleEvents=true&orderBy=startTime`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      const events = (data.items || []).map(e => ({
        id: e.id,
        title: e.summary || 'Sans titre',
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        description: e.description || ''
      }));

      result = { events };

    } else if (action === 'create') {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: title,
          description: description || '',
          start: { dateTime: start, timeZone: 'Africa/Abidjan' },
          end: { dateTime: end, timeZone: 'Africa/Abidjan' }
        })
      });
      result = await res.json();
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };

  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
