function emailTemplate({
  title,
  heading,
  description,
  otp,
  expiry = "10 minutes"
}) {

  const formattedOtp =
    otp.slice(0, 3) + " " + otp.slice(3);

  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#040B14;">

<div style="
display:none;
max-height:0;
max-width:0;
overflow:hidden;
opacity:0;
font-size:1px;
line-height:1px;
color:#040B14;
">
${description}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#040B14;padding:32px 16px;">

<tr>

<td align="center">

<table
role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="max-width:600px;background:#09131F;border:1px solid #1D3148;border-radius:18px;">

<tr>

<td
align="center"
style="padding:40px 32px 24px;">

<div
style="
font-family:Arial,Helvetica,sans-serif;
font-size:36px;
font-weight:bold;
letter-spacing:6px;
color:#00FF87;
">
CODEHUNT
</div>

<div
style="
margin-top:10px;
font-family:Arial,Helvetica,sans-serif;
font-size:13px;
letter-spacing:2px;
color:#8FA8BD;
text-transform:uppercase;
">
Hunt • Level Up • Master C++
</div>

</td>

</tr>

<tr>

<td>

<table
role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
border="0">

<tr>

<td
height="1"
style="
background:#1D3148;
font-size:0;
line-height:0;
">

&nbsp;

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td
style="
padding:40px 32px 12px;
font-family:Arial,Helvetica,sans-serif;
">

<h1
style="
margin:0;
font-size:28px;
line-height:36px;
font-weight:bold;
color:#FFFFFF;
text-align:center;
">
${heading}
</h1>

</td>

</tr>

<tr>

<td
style="
padding:0 32px;
">

<p
style="
margin:0;
font-family:Arial,Helvetica,sans-serif;
font-size:16px;
line-height:28px;
color:#C8D6E3;
text-align:center;
">
${description}
</p>

</td>

</tr>

<tr>

<td
align="center"
style="
padding:36px 32px;
">

<table
role="presentation"
cellpadding="0"
cellspacing="0"
border="0"
style="
width:100%;
max-width:340px;
background:#05101A;
border:2px solid #00FF87;
border-radius:14px;
">

<tr>

<td
align="center"
style="
padding:22px;
font-family:Consolas,Courier New,monospace;
font-size:38px;
font-weight:bold;
letter-spacing:6px;
color:#00FF87;
">

${formattedOtp}

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td
style="
padding:0 32px;
">

<p
style="
margin:0;
text-align:center;
font-family:Arial,Helvetica,sans-serif;
font-size:15px;
line-height:24px;
color:#00E5FF;
">

This code is valid for
<strong>${expiry}</strong>.

</p>

</td>

</tr>

<tr>

<td
style="
padding:36px 32px 0;
">

<table
role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="
background:#06111D;
border-left:4px solid #00FF87;
border-radius:10px;
">

<tr>

<td
style="
padding:18px 20px;
font-family:Arial,Helvetica,sans-serif;
">

<div
style="
font-size:16px;
font-weight:bold;
color:#FFFFFF;
margin-bottom:10px;
">

Security Notice

</div>

<div
style="
font-size:14px;
line-height:24px;
color:#C8D6E3;
">

• Never share this verification code with anyone.<br>
• CodeHunt will never ask for your OTP.<br>
• If you didn't request this email, you can safely ignore it.

</div>

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td>

<table
role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="margin-top:36px;">

<tr>

<td
height="1"
style="
background:#1D3148;
font-size:0;
line-height:0;
">

&nbsp;

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td
align="center"
style="
padding:0 32px 32px;
">

<div
style="
font-family:Arial,Helvetica,sans-serif;
font-size:18px;
font-weight:bold;
color:#00FF87;
margin-bottom:10px;
">

Happy Hunting ⚡

</div>

<div
style="
font-family:Arial,Helvetica,sans-serif;
font-size:14px;
color:#8FA8BD;
line-height:24px;
">

— Team CodeHunt

</div>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
}

module.exports = emailTemplate;