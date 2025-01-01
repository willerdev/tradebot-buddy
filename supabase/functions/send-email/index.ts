import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELASTIC_EMAIL_API_KEY = Deno.env.get('ELASTIC_EMAIL_API_KEY');
const ELASTIC_EMAIL_API_URL = 'https://api.elasticemail.com/v4/emails';
const DEFAULT_EMAIL = "willeratmit12@gmail.com";

interface EmailRequestBody {
  to?: string;
  subject: string;
  amount: number;
  currency: string;
  walletAddress: string;
  status: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received email request');
    const { subject, amount, currency, walletAddress, status } = await req.json() as EmailRequestBody;
    
    // Always use default email for testing
    const to = DEFAULT_EMAIL;
    
    console.log('Preparing to send email to:', to);

    // Your HTML template with replaced values
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>Withdrawal Notification</title>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2e66ff;">Withdrawal Notification</h1>
        <p>Your withdrawal request has been received with the following details:</p>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ${amount} ${currency}</p>
          <p><strong>Wallet Address:</strong> ${walletAddress}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
        <p>We will process your withdrawal request as soon as possible.</p>
        <p style="color: #5F5F5F; font-size: 14px;">This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>`;

    if (!ELASTIC_EMAIL_API_KEY) {
      console.error('ELASTIC_EMAIL_API_KEY is not set');
      throw new Error('Email API key is not configured');
    }

    const emailData = {
      Recipients: [{ Email: to }],
      Content: {
        Body: [{
          ContentType: "HTML",
          Content: htmlContent
        }],
        Subject: subject,
        From: "noreply@murafx.com"
      }
    };

    console.log('Sending email with data:', JSON.stringify(emailData, null, 2));

    const response = await fetch(ELASTIC_EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': ELASTIC_EMAIL_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    const responseText = await response.text();
    console.log('Elastic Email API response:', response.status, responseText);

    if (!response.ok) {
      throw new Error(`Failed to send email: ${responseText}`);
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully", response: responseText }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message,
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});