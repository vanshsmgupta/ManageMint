import emailjs from '@emailjs/browser';

// EmailJS configuration for timesheet emails
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// EmailJS configuration for password emails - using hardcoded values from screenshot
const EMAILJS_SERVICE_ID_2 = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_6qapr5j";
const EMAILJS_TEMPLATE_ID_2 = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_gxaszm8";
const EMAILJS_PUBLIC_KEY_2 = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_2;

// Initialize EmailJS with better error handling
const initializeEmailJS = () => {
  try {
    if (!EMAILJS_PUBLIC_KEY_2) {
      console.error('EmailJS Public Key is missing. Please check your environment variables.');
      return false;
    }
    emailjs.init(EMAILJS_PUBLIC_KEY_2);
    console.log('EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

// Verify EmailJS configuration with detailed logging
const verifyEmailJSConfig = () => {
  console.log('Verifying EmailJS configuration...');
  
  if (!EMAILJS_SERVICE_ID_2) {
    console.error('EmailJS Service ID is missing');
    return false;
  }
  console.log('Service ID verified');

  if (!EMAILJS_TEMPLATE_ID_2) {
    console.error('EmailJS Template ID is missing');
    return false;
  }
  console.log('Template ID verified');

  if (!EMAILJS_PUBLIC_KEY_2) {
    console.error('EmailJS Public Key is missing');
    return false;
  }
  console.log('Public Key verified');

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
      header_image: 'https://i.imgur.com/7nrLVBg.png', // You can replace this with your company logo
      message: `We're excited to have you join our team! Your account has been successfully created, and you can now access the Task Management System. Here are your login credentials:`,
      footer_message: `For security reasons, we recommend changing your password after your first login. If you have any questions or need assistance, please don't hesitate to reach out to our support team.`,
      company_name: 'Task Management System',
      company_address: 'Your Company Address',
      social_links: {
        linkedin: 'https://linkedin.com/company/yourcompany',
        twitter: 'https://twitter.com/yourcompany'
      },
      accent_color: '#6366f1', // Indigo color matching your UI
      background_color: '#1f2937', // Dark background matching your UI
      reply_to: 'support@taskmanagement.com'
    };

    console.log('Attempting to send email with config:', {
      serviceId: EMAILJS_SERVICE_ID_2,
      templateId: EMAILJS_TEMPLATE_ID_2,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY_2,
      templateParams: {
        ...templateParams,
        password: '****' // Hide password in logs
      }
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID_2,
      EMAILJS_TEMPLATE_ID_2,
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

export const testEmailService = async (): Promise<boolean> => {
  try {
    if (!verifyEmailJSConfig()) {
      throw new Error('EmailJS configuration is incomplete');
    }

    const templateParams = {
      to_email: 'gvansh2434@gmail.com',
      to_name: 'Test User',
      password: 'TestPassword123',
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

    console.log('Sending test email with config:', {
      serviceId: EMAILJS_SERVICE_ID_2,
      templateId: EMAILJS_TEMPLATE_ID_2,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY_2,
      templateParams: {
        ...templateParams,
        password: '****' // Hide password in logs
      }
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID_2,
      EMAILJS_TEMPLATE_ID_2,
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