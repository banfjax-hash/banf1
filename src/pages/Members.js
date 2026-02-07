// Members Directory Page
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { searchMembers, getMemberProfile } from 'backend/member-directory-service.jsw';
import { login, register, getCurrentMember } from 'backend/member-auth.jsw';

let currentUser = null;

$w.onReady(async function () {
    await checkLoginStatus();
    setupSearch();
    setupLoginForm();
    setupRegistrationForm();
});

async function checkLoginStatus() {
    try {
        if (wixUsers.currentUser.loggedIn) {
            currentUser = await getCurrentMember();
            showMemberView();
            loadMemberDirectory();
        } else {
            showLoginView();
        }
    } catch (e) {
        showLoginView();
    }
}

function showLoginView() {
    if ($w('#boxLogin').exists) $w('#boxLogin').show();
    if ($w('#boxMemberContent').exists) $w('#boxMemberContent').hide();
}

function showMemberView() {
    if ($w('#boxLogin').exists) $w('#boxLogin').hide();
    if ($w('#boxMemberContent').exists) $w('#boxMemberContent').show();
    
    if (currentUser && $w('#txtWelcome').exists) {
        $w('#txtWelcome').text = `Welcome, ${currentUser.firstName || 'Member'}!`;
    }
}

async function loadMemberDirectory() {
    try {
        const members = await searchMembers('', 50);
        displayMembers(members);
    } catch (e) {
        console.error('Error loading directory:', e);
    }
}

function displayMembers(members) {
    if ($w('#repeaterMembers').exists) {
        $w('#repeaterMembers').data = members;
        $w('#repeaterMembers').onItemReady(($item, itemData) => {
            $item('#imgMember').src = itemData.photo || 'https://static.wixstatic.com/media/avatar.png';
            $item('#txtMemberName').text = `${itemData.firstName} ${itemData.lastName}`;
            $item('#txtMemberRole').text = itemData.membershipType || 'Member';
            
            $item('#btnViewProfile').onClick(() => {
                wixLocation.to(`/member-profile?id=${itemData._id}`);
            });
        });
    }
}

function setupSearch() {
    if ($w('#inputMemberSearch').exists) {
        $w('#inputMemberSearch').onInput(async (event) => {
            const query = event.target.value;
            if (query.length >= 2) {
                const results = await searchMembers(query, 20);
                displayMembers(results);
            } else if (query.length === 0) {
                loadMemberDirectory();
            }
        });
    }
}

function setupLoginForm() {
    if ($w('#btnLogin').exists) {
        $w('#btnLogin').onClick(async () => {
            const email = $w('#inputEmail').value;
            const password = $w('#inputPassword').value;
            
            try {
                $w('#btnLogin').disable();
                $w('#txtLoginError').hide();
                
                const result = await login(email, password);
                if (result.success) {
                    currentUser = result.member;
                    showMemberView();
                    loadMemberDirectory();
                } else {
                    $w('#txtLoginError').text = result.message || 'Login failed';
                    $w('#txtLoginError').show();
                }
            } catch (e) {
                $w('#txtLoginError').text = 'Login error. Please try again.';
                $w('#txtLoginError').show();
            } finally {
                $w('#btnLogin').enable();
            }
        });
    }
}

function setupRegistrationForm() {
    if ($w('#btnShowRegister').exists) {
        $w('#btnShowRegister').onClick(() => {
            if ($w('#boxLoginForm').exists) $w('#boxLoginForm').hide();
            if ($w('#boxRegisterForm').exists) $w('#boxRegisterForm').show();
        });
    }
    
    if ($w('#btnRegister').exists) {
        $w('#btnRegister').onClick(async () => {
            const data = {
                email: $w('#inputRegEmail').value,
                password: $w('#inputRegPassword').value,
                firstName: $w('#inputFirstName').value,
                lastName: $w('#inputLastName').value,
                phone: $w('#inputPhone').value
            };
            
            try {
                $w('#btnRegister').disable();
                const result = await register(data);
                
                if (result.success) {
                    $w('#txtRegSuccess').text = 'Registration successful! Please login.';
                    $w('#txtRegSuccess').show();
                    setTimeout(() => {
                        if ($w('#boxRegisterForm').exists) $w('#boxRegisterForm').hide();
                        if ($w('#boxLoginForm').exists) $w('#boxLoginForm').show();
                    }, 2000);
                } else {
                    $w('#txtRegError').text = result.message || 'Registration failed';
                    $w('#txtRegError').show();
                }
            } catch (e) {
                $w('#txtRegError').text = 'Registration error. Please try again.';
                $w('#txtRegError').show();
            } finally {
                $w('#btnRegister').enable();
            }
        });
    }
}
