import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const PHONE_NUMBER = import.meta.env.VITE_SMS_PHONE_NUMBER;

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

/**
 * Send SMS notification via EmailJS to AT&T email-to-SMS gateway
 * @param {string} message - The message to send
 * @returns {Promise} - EmailJS send promise
 */
export async function sendSMSNotification(message) {
  try {
    const templateParams = {
      to_number: `${PHONE_NUMBER}@tmomail.net`,
      message: message
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('SMS notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    throw error;
  }
}

/**
 * Send event notification for high/medium severity events
 * @param {Object} event - Event object with type, description, severity
 */
export function notifyEvent(event) {
  // Only send SMS for medium and high severity events
  if (event.severity === 'medium' || event.severity === 'high') {
    const message = `[${event.severity.toUpperCase()}] ${event.description} at ${event.time}`;

    // Send SMS notification (async, non-blocking)
    sendSMSNotification(message).catch(err => {
      console.error('SMS notification failed:', err);
    });
  }
}
