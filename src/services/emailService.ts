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
    console.log('Starting email send process...');
    
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
      message: `We're excited to have you join our team! Your account has been successfully created, and you can now access the Task Management System. Here are your login credentials:`,
      footer_message: `For security reasons, we recommend changing your password after your first login. If you have any questions or need assistance, please don't hesitate to reach out to our support team.`,
      company_name: 'Task Management System',
      company_address: 'Your Company Address',
      social_links: {
        linkedin: 'https://linkedin.com/company/yourcompany',
        twitter: 'https://twitter.com/yourcompany'
      },
      accent_color: '#6366f1',
      background_color: '#1f2937',
      reply_to: 'support@taskmanagement.com'
    };

    console.log('Attempting to send email with config:', {
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
      timestamp: new Date().toISOString()
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error sending password email:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
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