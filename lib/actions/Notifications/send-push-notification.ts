"use server"

export async function sendPushNotification(text: string, author: string) {
  const ONESIGNAL_APP_ID = "0ec6f03d-f8e2-4e3c-8c76-8e02868443bc"; 
  const ONESIGNAL_API_KEY = "os_v2_app_b3dpappy4jhdzddwrybinbcdxqzaohopvt4en652dxglr4cm3yn33fbxienlvy67cbfdi3vsclbdc5ixdow3afazm5jf246uco4jv7q"; 

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Basic ${ONESIGNAL_API_KEY}`
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['Total Subscriptions'], // Manda pra todo mundo
      headings: { 
        en: "Uma frase acabou de ser adicionada, venha ver! 🥔" 
      },
      contents: { 
        en: `"${text}" ~ ${author}` 
      },
      url: "https://cadernobatata.vercel.app" // Link que abre ao clicar
    })
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', options);
    const data = await response.json();
    console.log("📣 Notificação enviada:", data);
  } catch (err) {
    console.error("❌ Erro ao enviar notificação:", err);
  }
}