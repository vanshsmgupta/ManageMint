import emailjs from '@emailjs/browser';

// EmailJS configuration with hardcoded values for password emails
const EMAILJS_SERVICE_ID = "service_6qapr5j";  // Hardcoding the working service ID
const EMAILJS_TEMPLATE_ID = "template_gxaszm8"; // Hardcoding the working template ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_2;

// Initialize EmailJS with better error handling
const initializeEmailJS = () => {
  try {
    if (!EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS Public Key is missing. Please check your environment variables.');
      return false;
    }
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized successfully with public key:', EMAILJS_PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

// Verify EmailJS configuration with detailed logging
const verifyEmailJSConfig = () => {
  console.log('Verifying EmailJS configuration...');
  
  if (!EMAILJS_SERVICE_ID) {
    console.error('EmailJS Service ID is missing');
    return false;
  }
  console.log('Service ID verified:', EMAILJS_SERVICE_ID);

  if (!EMAILJS_TEMPLATE_ID) {
    console.error('EmailJS Template ID is missing');
    return false;
  }
  console.log('Template ID verified:', EMAILJS_TEMPLATE_ID);

  if (!EMAILJS_PUBLIC_KEY) {
    console.error('EmailJS Public Key is missing');
    return false;
  }
  console.log('Public Key verified:', EMAILJS_PUBLIC_KEY);

  console.log('EmailJS configuration is complete');
  return true;
};

// Initialize EmailJS when the module loads
const isInitialized = initializeEmailJS();

export const sendPasswordEmail = async (
  userEmail: string,
  userName: string,
  password: string
): Promise<boolean> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      console.error('Invalid email format:', userEmail);
      return false;
    }

    console.log('Starting email send process...', { 
      recipient: userEmail,
      userName,
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID
    });
    
    if (!isInitialized) {
      console.error('EmailJS was not properly initialized');
      return false;
    }

    if (!verifyEmailJSConfig()) {
      throw new Error('EmailJS configuration is incomplete');
    }

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      password: password,
      login_url: window.location.origin + '/login',
      from_name: 'Task Management System',
      subject: 'Welcome to Task Management System - Your Account Details',
      title: 'Welcome to Our Team! 🎉',
      header_image: 'https://i.imgur.com/7nrLVBg.png',
      message: `We're excited to have you join our team! Your account has been successfully created, and you can now access the Task Management System.`,
      footer_message: `For security reasons, we recommend changing your password after your first login. If you have any questions or need assistance, please don't hesitate to reach out to our support team.`,
      company_name: 'Task Management System',
      company_address: 'Your Company Address',
      social_links: {
        linkedin: 'https://linkedin.com/company/yourcompany',
        twitter: 'https://twitter.com/yourcompany'
      },
      accent_color: '#6366f1',
      background_color: '#1C1F26',
      template_html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to {{company_name}}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: {{background_color}};
                    color: #E2E8F0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .card {
                    background-color: #262B36;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    margin: 20px 0;
                }
                .header {
                    background-color: #1A1E27;
                    padding: 30px 20px;
                    text-align: center;
                    border-bottom: 2px solid {{accent_color}};
                }
                .logo {
                    max-width: 150px;
                    height: auto;
                    margin-bottom: 20px;
                }
                .content {
                    padding: 30px;
                }
                .title {
                    color: {{accent_color}};
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .welcome-text {
                    color: #E2E8F0;
                    font-size: 16px;
                    margin-bottom: 30px;
                }
                .credentials-box {
                    background-color: #1A1E27;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid {{accent_color}};
                }
                .credentials-box p {
                    margin: 10px 0;
                    color: #E2E8F0;
                }
                .credentials-box strong {
                    color: #FFFFFF;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: {{accent_color}};
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #4F46E5;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #94A3B8;
                    font-size: 14px;
                    border-top: 1px solid #374151;
                }
                .social-links {
                    margin-top: 20px;
                }
                .social-links a {
                    color: {{accent_color}};
                    margin: 0 10px;
                    text-decoration: none;
                    font-weight: 500;
                }
                .important-note {
                    background-color: rgba(99, 102, 241, 0.1);
                    border-radius: 6px;
                    padding: 15px;
                    margin-top: 20px;
                    color: #E2E8F0;
                    font-size: 14px;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .title {
                        font-size: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <img src="{{header_image}}" alt="{{company_name}}" class="logo">
                        <div class="title">{{title}}</div>
                    </div>
                    <div class="content">
                        <div class="welcome-text">
                            <p>Dear {{to_name}},</p>
                            <p>{{message}}</p>
                        </div>
                        
                        <div class="credentials-box">
                            <p><strong>Email:</strong> {{to_email}}</p>
                            <p><strong>Temporary Password:</strong> {{password}}</p>
                        </div>
                        
                        <div class="button-container">
                            <a href="{{login_url}}" class="button">Login to Your Account</a>
                        </div>
                        
                        <div class="important-note">
                            <strong>Important:</strong> {{footer_message}}
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>{{company_name}}</p>
                        <p>{{company_address}}</p>
                        <div class="social-links">
                            <a href="{{social_links.linkedin}}">LinkedIn</a>
                            <a href="{{social_links.twitter}}">Twitter</a>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Double check recipient before sending
    if (templateParams.to_email !== userEmail) {
      throw new Error('Recipient email mismatch in template params');
    }

    // Log the full configuration before sending
    console.log('Sending email to:', userEmail);
    console.log('Email configuration:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY,
      templateParams: {
        ...templateParams,
        password: '****' // Hide password in logs
      }
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('EmailJS Response:', {
      status: response.status,
      text: response.text,
      timestamp: new Date().toISOString(),
      recipient: userEmail,
      success: response.status === 200
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error sending password email:', {
      error,
      recipient: userEmail,
      errorDetails: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : 'Unknown error type'
    });
    return false;
  }
};

// Test email function for verifying configuration
export const testEmailService = async (): Promise<boolean> => {
  try {
    if (!verifyEmailJSConfig()) {
      throw new Error('EmailJS configuration is incomplete');
    }

    const templateParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      password: 'TestPassword123',
      login_url: window.location.origin + '/login',
      from_name: 'Task Management System',
      subject: 'Test Email - Task Management System',
      title: 'Test Email',
      message: 'This is a test email to verify the EmailJS configuration.',
    };

    console.log('Sending test email with config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Test email response:', {
      status: response.status,
      text: response.text,
      timestamp: new Date().toISOString()
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error in test email:', error);
    return false;
  }
}; 