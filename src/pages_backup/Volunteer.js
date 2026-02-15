// Volunteer Page
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { getVolunteerOpportunities, applyForVolunteer, getMyVolunteerHistory } from 'backend/volunteer-service.jsw';

$w.onReady(async function () {
    await loadOpportunities();
    setupApplicationForm();
    
    if (wixUsers.currentUser.loggedIn) {
        await loadMyHistory();
    }
});

async function loadOpportunities() {
    try {
        const opportunities = await getVolunteerOpportunities();
        
        if ($w('#repeaterOpportunities').exists && opportunities.length > 0) {
            $w('#repeaterOpportunities').data = opportunities;
            $w('#repeaterOpportunities').onItemReady(($item, itemData) => {
                $item('#txtOpportunityTitle').text = itemData.title;
                $item('#txtOpportunityDate').text = formatDate(itemData.date);
                $item('#txtOpportunityLocation').text = itemData.location || 'TBD';
                $item('#txtOpportunityDesc').text = itemData.description || '';
                $item('#txtSpotsAvailable').text = `${itemData.spotsAvailable || 'Several'} spots available`;
                
                // Skills needed
                if (itemData.skillsNeeded && $item('#txtSkills').exists) {
                    $item('#txtSkills').text = 'Skills: ' + itemData.skillsNeeded.join(', ');
                }
                
                // Time commitment
                if ($item('#txtTimeCommitment').exists) {
                    $item('#txtTimeCommitment').text = itemData.timeCommitment || '';
                }
                
                $item('#btnApply').onClick(() => {
                    showApplicationForm(itemData);
                });
            });
        } else {
            $w('#txtNoOpportunities').show();
        }
        
    } catch (e) {
        console.error('Error loading opportunities:', e);
    }
}

function showApplicationForm(opportunity) {
    // Store selected opportunity
    $w('#hiddenOpportunityId').value = opportunity._id;
    $w('#txtSelectedOpportunity').text = opportunity.title;
    
    // Show the form
    if ($w('#boxApplicationForm').exists) {
        $w('#boxApplicationForm').show();
        $w('#boxApplicationForm').scrollTo();
    }
}

function setupApplicationForm() {
    if ($w('#btnSubmitApplication').exists) {
        $w('#btnSubmitApplication').onClick(async () => {
            const application = {
                opportunityId: $w('#hiddenOpportunityId').value,
                firstName: $w('#inputVolFirstName').value,
                lastName: $w('#inputVolLastName').value,
                email: $w('#inputVolEmail').value,
                phone: $w('#inputVolPhone').value,
                experience: $w('#textareaExperience').value,
                availability: $w('#inputAvailability').value,
                skills: $w('#inputSkills').value,
                whyInterested: $w('#textareaWhy').value
            };
            
            // Validate required fields
            if (!application.firstName || !application.lastName || !application.email) {
                $w('#txtFormError').text = 'Please fill in all required fields';
                $w('#txtFormError').show();
                return;
            }
            
            try {
                $w('#btnSubmitApplication').disable();
                $w('#txtFormError').hide();
                
                const result = await applyForVolunteer(application);
                
                if (result.success) {
                    $w('#boxApplicationForm').hide();
                    $w('#boxThankYou').show();
                    $w('#txtThankYou').text = `Thank you ${application.firstName}! We'll be in touch soon about "${$w('#txtSelectedOpportunity').text}"`;
                } else {
                    $w('#txtFormError').text = result.message || 'Application failed. Please try again.';
                    $w('#txtFormError').show();
                }
            } catch (e) {
                $w('#txtFormError').text = 'Error submitting application. Please try again.';
                $w('#txtFormError').show();
            } finally {
                $w('#btnSubmitApplication').enable();
            }
        });
    }
    
    // Cancel button
    if ($w('#btnCancelApplication').exists) {
        $w('#btnCancelApplication').onClick(() => {
            $w('#boxApplicationForm').hide();
            clearForm();
        });
    }
}

async function loadMyHistory() {
    try {
        const history = await getMyVolunteerHistory();
        
        if ($w('#boxMyHistory').exists && history.length > 0) {
            $w('#boxMyHistory').show();
            $w('#repeaterMyHistory').data = history;
            $w('#repeaterMyHistory').onItemReady(($item, itemData) => {
                $item('#txtHistoryTitle').text = itemData.opportunityTitle;
                $item('#txtHistoryDate').text = formatDate(itemData.date);
                $item('#txtHistoryHours').text = `${itemData.hoursLogged || 0} hours`;
                $item('#txtHistoryStatus').text = itemData.status;
            });
            
            // Calculate total hours
            const totalHours = history.reduce((sum, h) => sum + (h.hoursLogged || 0), 0);
            $w('#txtTotalHours').text = `Total Volunteer Hours: ${totalHours}`;
        }
    } catch (e) {
        console.log('History loading:', e.message);
    }
}

function clearForm() {
    const inputs = ['inputVolFirstName', 'inputVolLastName', 'inputVolEmail', 'inputVolPhone', 
                   'textareaExperience', 'inputAvailability', 'inputSkills', 'textareaWhy'];
    inputs.forEach(id => {
        if ($w(`#${id}`).exists) $w(`#${id}`).value = '';
    });
}

function formatDate(dateStr) {
    if (!dateStr) return 'Date TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}
