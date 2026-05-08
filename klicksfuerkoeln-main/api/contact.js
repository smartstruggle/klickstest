export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ message: "Method not allowed" });
}

try {
const { name, email, message } = req.body ?? {};

if (!name || !email || !message) {
return res.status(400).json({ message: "Bitte alle Felder ausfüllen." });
}

const response = await fetch("https://api.brevo.com/v3/smtp/email", {
method: "POST",
headers: {
"Content-Type": "application/json",
"api-key": process.env.BREVO_API_KEY,
},
body: JSON.stringify({
sender: {
name: "Klicks für Köln",
email: "info@klicksfuerkoeln.de",
},
to: [
{
email: "info@klicksfuerkoeln.de",
},
],
replyTo: {
email,
name,
},
subject: `Neue Anfrage von ${name}`,
htmlContent: `
<h2>Neue Anfrage</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>E-Mail:</strong> ${email}</p>
<p><strong>Nachricht:</strong><br>${message.replace(/\n/g, "<br>")}</p>
`,
}),
});

if (!response.ok) {
const err = await response.text();
console.error(err);
return res.status(500).json({ message: "E-Mail konnte nicht gesendet werden." });
}

return res.status(200).json({ message: "Erfolgreich gesendet!" });
} catch (error) {
console.error(error);
return res.status(500).json({ message: "Serverfehler" });
}
}
