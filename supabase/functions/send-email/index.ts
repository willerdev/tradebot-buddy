import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELASTIC_EMAIL_API_KEY = Deno.env.get("ELASTIC_EMAIL_API_KEY");
const ELASTIC_EMAIL_FROM = Deno.env.get("ELASTIC_EMAIL_FROM");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  amount: number;
  currency: string;
  walletAddress: string;
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, amount, currency, walletAddress, status } = await req.json() as EmailRequest;

    // Replace placeholders in the template
    const currentDate = new Date().toLocaleDateString();
    let emailTemplate = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title></title>

  <!--[if !mso]><!-->
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap);
  </style>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i &subset=cyrillic,latin-ext" data-name="open_sans" rel="stylesheet" type="text/css">
  <!--<![endif]-->

  <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->

  <!--[if mso]>
        <style>
            * {
                font-family: sans-serif !important;
            }
        </style>
    <![endif]-->

  <!--[if !mso]><!-->
  <!-- insert web font reference, eg: <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i &subset=cyrillic,latin-ext" rel='stylesheet' type='text/css'> -->
  <!--<![endif]-->


  <style>
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }

    html,
    body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
    }

    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }

    #MessageViewBody,
    #MessageWebViewDiv {
      width: 100% !important;
    }

    table,
    td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }

    th {
      font-weight: normal;
    }

    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }

    a {
      text-decoration: none;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    a[x-apple-data-detectors],
    /* iOS */
    .unstyle-auto-detected-links a,
    .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .im {
      color: inherit !important;
    }

    .a6S {
      display: none !important;
      opacity: 0.01 !important;
    }

    img.g-img+div {
      display: none !important;
    }

    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u~div .email-container {
        min-width: 320px !important;
      }
    }

    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u~div .email-container {
        min-width: 375px !important;
      }
    }

    @media only screen and (min-device-width: 414px) {
      u~div .email-container {
        min-width: 414px !important;
      }
    }
  </style>

  <style>
    .button-td,
    .button-a {
      transition: all 100ms ease-in;
    }

    .button-td-primary:hover,
    .button-a-primary:hover {
      background: #5582ff !important;
      border-color: #5582ff !important;
    }

    .email-container p.column-header {
      padding-top: 30px;
    }

    @media screen and (max-width: 600px) {

      .email-container {
        width: 100% !important;
        margin: auto !important;
      }

      .stack-column,
      .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
      }

      .stack-column-center {
        text-align: center !important;
      }

      .center-on-narrow {
        text-align: center !important;
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
      }

      table.center-on-narrow {
        display: inline-block !important;
      }

      .email-container p {
        font-size: 15px !important;
      }

      .email-container p.header-text {
        font-size: 32px !important;
      }

      .email-container p.column-header {
        font-size: 19px !important;
        padding-top: 32px;
      }

      .email-container .grid img {
        max-width: 100% !important;
      }

      .email-container .grid .mobile-gap {
        padding-bottom: 48px;
      }

      .email-container .grid .link-button {
        padding: 32px 10px 10px !important;
      }

      .email-container .logo img {
        width: 100% !important;
      }
    }
  </style>

</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #F5F6F8;">
  <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #F5F6F8;">
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F6F8;">
    <tr>
    <td>
    <![endif]-->
    <!-- Email Body -->
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="margin: auto;" class="email-container">

      <!-- Unsubscribe -->
      <tr>
        <td style="padding: 20px 32px; text-align: center">
          <p style="height: auto; margin: 15px 0; background: #F5F6F8; font-family: Open Sans; font-size: 11px; line-height: 15px; color: #555555; background-color: #F5F6F8;">
            Unable to view? Read it <a href="{view}" class="link-btn">online</a></p>
        </td>
      </tr>

      <!-- Logo -->
      <tr>
        <td class="logo" style="padding: 10px 0 32px; text-align: center">
          <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/default-logo.png" width="380" height="46" alt="logo" border="0" style="height: auto;background: #F5F6F8;font-family: Open Sans;font-size: 15px;line-height: 15px;color: #555555;background-color: #F5F6F8;" bgcolor="#F5F6F8">
        </td>
      </tr>

      <!-- Header image -->
      <tr>
        <td>
          <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/hero-image5.jpg" width="640" height="" alt="alt_text" border="0" style="width: 100%; max-width: 640px; height: auto; margin: auto; display: block;" class="g-img">
        </td>
      </tr>

      <!-- Section: email title -->
      <tr>
        <td style="padding: 48px 32px 20px; text-align: center; background-color: #ffffff;">
          <p class="header-text" style="height: auto; margin: 15px 0; background: #ffffff; font-family: Open Sans; text-align: center; font-size: 32px; line-height: 34px; color: #000000; background-color: #ffffff;">
            Withdrawal Notification
          </p>
          <p style="height: auto; margin: 28px 0 15px; background: #ffffff; text-align: center; font-family: Open Sans; font-size: 15px; line-height: 27px; color: #5F5F5F; background-color: #ffffff;">
            Your withdrawal request for ${amount} ${currency} to wallet ${walletAddress} has been ${status}. Date: ${currentDate}
          </p>
        </td>
      </tr>
      <td style="padding: 20px 32px 64px; text-align: center; background-color: #ffffff;">
        <!-- Button -->
        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto; padding: 20px;">
          <tr>
            <td class="button-td button-td-primary" style="border-radius: 4px; background: #2e66ff;">
              <a class="button-a button-a-primary" href="#" style="background: #2e66ff; border: 1px solid #2e66ff; font-family: Open Sans; font-size: 16px; line-height: inherit; text-decoration: none; padding: 16px; color: #ffffff; display: block; border-radius: 4px;">
                Awesome button
              </a>
            </td>
          </tr>
        </table>
      </td>

      <!-- Section: columns -->
      <tr>
        <td style="padding: 64px 32px 0; text-align: center; background-color: #f9fafb;">
          <p class="header-text" style="height: auto; margin: 0; background: #f9fafb; font-family: Open Sans; font-size: 32px; line-height: 34px; color: #000000; background-color: #f9fafb;">
            Section: columns
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 32px 32px; text-align: center; background-color: #f9fafb;">
          <p style="height: auto; margin: 4px 0px; background: #f9fafb; font-family: Open Sans; font-size: 15px; line-height: 27px; color: #5F5F5F; background-color: #f9fafb;">
            A layout with images, texts and links aligned vertically.
          </p>
        </td>
      </tr>

      <!-- Columns -->
      <tr>
        <td style="padding: 0 0 58px; background-color: #f9fafb;">
          <table role="presentation" class="grid" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <th valign="top" width="33.33%" class="stack-column-center mobile-gap">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 10px; text-align: center">
                      <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/pexels-pixabay-417173.jpg" width="170" height="" alt="alt_text" border="0" style="width: 100%; max-width: 170px; height: auto; background: #f9fafb; font-family: Open Sans; font-size: 15px; line-height: 15px; color: #555555;">
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 19px; line-height: 29px; color: #000000; padding: 0 10px 10px; text-align: center;" class="center-on-narrow">
                      <p class="column-header" style="margin: 0;">Small title</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 15px; line-height: 27px; color: #555555; padding: 0 10px 10px; text-align: center;" class="center-on-narrow">
                      <p style="margin: 0 0 32px;">Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 15px; line-height: 27px; color: #5457FF; padding: 0 10px 10px; text-align: center;" class="center-on-narrow link-button">
                      <a class="button-a" href="#">Read more</a>
                    </td>
                  </tr>
                </table>
              </th>
              <th valign="top" width="33.33%" class="stack-column-center mobile-gap">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 10px; text-align: center">
                      <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/pexels-brady-knoll-5409751.jpg" width="170" height="" alt="alt_text" border="0" style="width: 100%; max-width: 170px; height: auto; background: #f9fafb; font-family: Open Sans; font-size: 15px; line-height: 15px; color: #555555;">
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 19px; line-height: 29px; color: #000000; padding: 0 10px 10px; text-align: center;" class="center-on-narrow">
                      <p class="column-header" style="margin: 0;">Small title</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 15px; line-height: 27px; color: #555555; padding: 0 10px 10px; text-align: center;" class="center-on-narrow">
                      <p style="margin: 0 0 32px;">Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 15px; line-height: 27px; color: #5457FF; padding: 0 10px 10px; text-align: center;" class="center-on-narrow link-button">
                      <a class="button-a" href="#">Read more</a>
                    </td>
                  </tr>
                </table>
              </th>
              <th valign="top" width="33.33%" class="stack-column-center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 10px; text-align: center">
                      <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/pexels-pixabay-326058.jpg" width="170" height="" alt="alt_text" border="0" style="width: 100%; max-width: 170px; height: auto; background: #f9fafb; font-family: Open Sans; font-size: 15px; line-height: 15px; color: #555555;">
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 19px; line-height: 29px; color: #000000; padding: 0 10px 10px; text-align: center;" class="center-on-narrow">
                      <p class="column-header" style="margin: 0;">Small title</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 15px; line-height: 27px; color: #555555; padding: 0 10px 10px; text-align: center;" class="center-on-narrow">
                      <p style="margin: 0 0 32px;">Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor. </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Open Sans; font-size: 15px; line-height: 27px; color: #5457FF; padding: 0 10px 10px; text-align: center;" class="center-on-narrow link-button">
                      <a class="button-a" href="#">Read more</a>
                    </td>
                  </tr>
                </table>
              </th>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Section: about the author -->
      <tr>
        <td style="padding: 64px 20px 32px; text-align: center; background: #ffffff; background-color: #ffffff;" bgcolor="#ffffff">
          <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/author-default.png" width="120" height="120" alt="logo" border="0" style="height: auto; background: #ffffff; background-color: #ffffff;" bgcolor="#ffffff">
        </td>
      </tr>
      <tr>
        <td style="padding: 0 32x 0; text-align: center; background: #ffffff; background-color: #ffffff;" bgcolor="#ffffff">
          <p class="header-text" style="height: auto; margin: 15px 0; background: #ffffff; font-family: Open Sans; font-size: 31px; line-height: 34px; color: #000000; background-color: #ffffff;">
            Section: about the author
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 32px; text-align: center; background: #ffffff; background-color: #ffffff;" bgcolor="#ffffff">
          <p style="height: auto; margin: 0; background: #ffffff; font-family: Open Sans; font-size: 15px; line-height: 27px; color: #5F5F5F; background-color: #ffffff;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pulvinar lorem quis ante dapibus
            ullamcorper. Cras facilisis erat ornare nulla varius.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background: #ffffff; background-color: #ffffff;" bgcolor="#ffffff">
          <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/footer-default.png" width="640" height="" alt="alt_text" border="0" style="width: 100%; max-width: 640px; height: auto; margin: auto; display: block;" class="g-img">
        </td>
      </tr>

      <!-- Social -->
      <tr>
        <td class="footer" align="center" valign="top" style="padding: 50px 0 28px;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center" valign="top">
                <a href="#" target="_blank">
                  <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/ro_sol_co_32_facebook2023-04-07T15_55_16.png" class="fadeimg" alt="Facebook" width="32" height="32" style="max-width: 32px;">
                </a>
              </td>
              <td align="center" valign="top" style="padding: 0 10px 0 20px;">
                <a href="#" target="_blank">
                  <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/ro_sol_co_32_twitter2023-04-07T15_55_16.png" class="fadeimg" alt="Twitter" width="32" height="32" style="max-width: 32px;">
                </a>
              </td>
              <td align="center" valign="top" style="padding: 0 20px 0 10px;">
                <a href="#" target="_blank">
                  <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/ro_sol_co_32_youtube2023-04-07T15_55_16.png" class="fadeimg" alt="You Tube" width="32" height="32" style="max-width: 32px;">
                </a>
              </td>
              <td align="center" valign="top">
                <a href="#" target="_blank">
                  <img src="https://api.smtprelay.co/userfile/a18de9fc-4724-42f2-b203-4992ceddc1de/ro_sol_co_32_linkedin2023-04-07T15_55_16.png" class="fadeimg" alt="Linked In" width="32" height="32" style="max-width: 32px;">
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Unsubscribe -->
      <tr>
        <td style="padding: 20px 32px 0px; text-align: center; background: #F5F6F8; background-color: #F5F6F8;" bgcolor="#F5F6F8">
          <p class="text-center small" style="height: auto; background: #F5F6F8; margin: 15px 0; font-family: Open Sans; font-size: 11px; line-height: 15px; color: #555555; background-color: #F5F6F8;">
            If you no longer wish to receive mail from us, you can <a href="{unsubscribe}" class="link-btn">unsubscribe</a>
          </p>
        </td>
      </tr>

      <!-- Account Address -->
      <tr>
        <td style="padding: 5px 32px 64px; text-align: center; background: #F5F6F8; background-color: #F5F6F8;" bgcolor="#F5F6F8">
          <p style="height: auto; margin: 0px; background: #F5F6F8; font-family: Open Sans; font-size: 11px; line-height: 15px; color: #555555; background-color: #F5F6F8;">
            {accountaddress}
          </p>
        </td>
      </tr>

    </table>

    <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </center>
</body>

</html>`;

    const response = await fetch("https://api.elasticemail.com/v4/emails/transactional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ElasticEmail-ApiKey": ELASTIC_EMAIL_API_KEY!,
      },
      body: JSON.stringify({
        Recipients: [{ Email: to }],
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Content: emailTemplate,
            },
          ],
          Subject: subject,
          From: ELASTIC_EMAIL_FROM,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
