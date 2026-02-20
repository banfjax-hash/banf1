// Contact.js
// BANF Contact Page

import wixWindow from 'wix-window';
import { submitContactForm } from 'backend/email.jsw';

$w.onReady(function () {
    console.log("📬 Contact page loading...");

    $w('#btnSendMessage').onClick(async () => {
        // Validate inputs
        const name = $w('#inputName').value;
        const email = $w('#inputEmail').value;
        const subject = $w('#inputSubject').value;
        const message = $w('#inputMessage').value;

        if (!name || !email || !message) {
            wixWindow.openLightbox('ErrorLightbox', {
                message: 'Please fill in all required fields.'
            });
            return;
        }

        try {
            $w('#btnSendMessage').disable();
            $w('#btnSendMessage').label = 'Sending...';

            await submitContactForm({ name, email, subject, message });

            // Clear form
            $w('#inputName').value = '';
            $w('#inputEmail').value = '';
            $w('#inputSubject').value = '';
            $w('#inputMessage').value = '';

            wixWindow.openLightbox('SuccessLightbox', {
                message: 'Thank you! Your message has been sent.'
            });
        } catch (err) {
            console.error("Contact form error:", err);
            wixWindow.openLightbox('ErrorLightbox', {
                message: 'Failed to send message. Please try again.'
            });
        } finally {
            $w('#btnSendMessage').enable();
            $w('#btnSendMessage').label = 'Send Message';
        }
    });
});
