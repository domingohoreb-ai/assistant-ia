xports.handler = async function(event, context) {

  if (event.httpMethod !== 'POST') {

    return { statusCode: 405, body: 'Method Not Allowed' };

  try {

    }

  if (!token) {

      const { token, action, messageId, to, subject, body } = JSON.parse(event.body);

    }

    return { statusCode: 401, body: JSON.stringify({ error: 'Token manquant' }) };

    let result;

    if (action === 'list') {

      // Liste les emails

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?

maxResults=10&q=is:unread', {

        });

      headers: { Authorization: `Bearer ${token}` }

      const data = await res.json();

      

      if (!data.messages) {

        return {

          headers: { 'Access-Control-Allow-Origin': '*' },

          statusCode: 200,

          body: JSON.stringify({ emails: [] })

        };

      // Récupère les détails de chaque email

      }

      const emails = await Promise.all(

        data.messages.slice(0, 5).map(async (msg) => {

          const detail = await

fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?

format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, {

            });

          headers: { Authorization: `Bearer ${token}` }

          const d = await detail.json();

          return {

            const headers = d.payload?.headers || [];

          id: msg.id,

            from: headers.find(h => h.name === 'From')?.value || 'Inconnu',

            subject: headers.find(h => h.name === 'Subject')?.value || 'Sans sujet',

            date: headers.find(h => h.name === 'Date')?.value || '',

            };

        snippet: d.snippet || ''

          })

      );

      result = { emails };} else if (action === 'send') {

      // Envoie un email

      const emailContent = [

        `To: ${to}`,

        `Subject: ${subject}`,

        'Content-Type: text/plain; charset=utf-8',

        '',

        body

      ].join('\n');

      const encoded = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-

').replace(/\//g, '_');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',

{

        method: 'POST',

        headers: {

          Authorization: `Bearer ${token}`,

          'Content-Type': 'application/json'

        body: JSON.stringify({ raw: encoded })

      },

        });

      result = await res.json();

    return {

      }

    statusCode: 200,

      body: JSON.stringify(result)

    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },

      } catch(e) {

    };

  return {

      statusCode: 500,

      headers: { 'Access-Control-Allow-Origin': '*' },

      body: JSON.stringify({ error: e.message })

    };

  }

}
