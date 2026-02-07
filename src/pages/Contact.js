// Contact Page
import wixLocation from 'wix-location';
import { sendContactMessage, submitFeedback } from 'backend/communication-hub.jsw';
import { submitComplaint } from 'backend/complaints.jsw';

$w.onReady(function () {
    // Pre-fill subject if passed via URL
    const urlParams = wixLocation.query;
    if (urlParams.subject && $w('#dropdownSubject').exists) {
        $w('#dropdownSubject').value = urlParams.subject;
    }
    
    setupContactForm();
    setupFeedbackForm();
    displayContactInfo();
});

function setupContactForm() {
    // Subject dropdown options
    if ($w('#dropdownSubject').exists) {
        $w('#dropdownSubject').options = [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Membership', value: 'membership' },
            { label: 'Events', value: 'events' },
            { label: 'Sponsorship', value: 'sponsorship' },
            { label: 'Volunteer', value: 'volunteer' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Feedback', value: 'feedback' },
            { label: 'Complaint', value: 'complaint' },
            { label: 'Other', value: 'other' }
        ];
    }
    
    // Submit contact form
    if ($w('#btnSendMessage').exists) {
        $w('#btnSendMessage').onClick(async () => {
            const message = {
                name: $w('#inputContactName').value,
                email: $w('#inputContactEmail').value,
                phone: $w('#inputContactPhone').value || '',
                subject: $w('#dropdownSubject').value || 'general',
                message: $w('#textareaMessage').value
            };
            
            // Validate
            if (!message.name || !message.email || !message.message) {
                showError('Please fill in all required fields (Name, Email, Message)');
                return;
            }
            
            if (!isValidEmail(message.email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            try {
                $w('#btnSendMessage').disable();
                $w('#txtContactError').hide();
                
                let result;
                if (message.subject === 'complaint') {
                    result = await submitComplaint(message);
                } else if (message.subject === 'feedback') {
                    result = await submitFeedback(message);
                } else {
                    result = await sendContactMessage(message);
                }
                
                if (result.success) {
                    showSuccess('Thank you! Your message has been sent. We\'ll respond within 24-48 hours.');
                    clearContactForm();
                } else {
                    showError(result.message || 'Failed to send message. Please try again.');
                }
            } catch (e) {
                showError('Error sending message. Please try again or email us directly.');
            } finally {
                $w('#btnSendMessage').enable();
            }
        });
    }
}

function setupFeedbackForm() {
    // Quick feedback buttons
    const feedbackTypes = ['positive', 'neutral', 'negative'];
    feedbackTypes.forEach(type => {
        const btnId = `#btnFeedback${type.charAt(0).toUpperCase() + type.slice(1)}`;
        if ($w(btnId).exists) {
            $w(btnId).onClick(async () => {
                const feedback = {
                    type: type,
                    page: wixLocation.url,
                    comment: $w('#inputQuickFeedback').value || ''
                };
                
                try {
                    await submitFeedback(feedback);
                    $w('#txtFeedbackThanks').show();
                    setTimeout(() => $w('#txtFeedbackThanks').hide(), 3000);
                } catch (e) {
                    console.log('Feedback error:', e);
                }
            });
        }
    });
}

function displayContactInfo() {
    // Set contact information
    const contactInfo = {
        email: 'info@banfjax.org',
        phone: '(904) XXX-XXXX',
        address: 'Jacksonville, FL',
        facebook: 'https://facebook.com/banfjax',
        instagram: 'https://instagram.com/banfjax'
    };
    
    if ($w('#txtContactEmail').exists) {
        $w('#txtContactEmail').text = contactInfo.email;
        $w('#linkContactEmail').link = `mailto:${contactInfo.email}`;
    }
    
    if ($w('#txtContactPhone').exists) {
        $w('#txtContactPhone').text = contactInfo.phone;
    }
    
    if ($w('#txtContactAddress').exists) {
        $w('#txtContactAddress').text = contactInfo.address;
    }
    
    // Social media links
    if ($w('#linkFacebook').exists) {
        $w('#linkFacebook').link = contactInfo.facebook;
    }
    
    if ($w('#linkInstagram').exists) {
        $w('#linkInstagram').link = contactInfo.instagram;
    }
}

function showError(message) {
    if ($w('#txtContactError').exists) {
        $w('#txtContactError').text = message;
        $w('#txtContactError').show();
    }
}

function showSuccess(message) {
    if ($w('#txtContactSuccess').exists) {
        $w('#txtContactSuccess').text = message;
        $w('#txtContactSuccess').show();
        $w('#txtContactError').hide();
    }
}

function clearContactForm() {
    const inputs = ['inputContactName', 'inputContactEmail', 'inputContactPhone', 'textareaMessage'];
    inputs.forEach(id => {
        if ($w(`#${id}`).exists) $w(`#${id}`).value = '';
    });
    if ($w('#dropdownSubject').exists) $w('#dropdownSubject').value = 'general';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
