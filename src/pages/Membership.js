// Membership.js
// BANF Membership & Benefits page

import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import { getMembershipPlans, registerMember } from 'backend/members.jsw';
import { processPayment } from 'backend/finance.jsw';

$w.onReady(async function () {
    console.log("💳 Membership page loading...");

    // Load membership plans
    await loadPlans();

    // Initialize buttons
    initMemberPortal();
    initPlanSelection();

    console.log("✅ Membership page ready");
});

async function loadPlans() {
    try {
        const plans = await getMembershipPlans();
        if (plans.student) $w('#studentPrice').text = `$${plans.student.price}/year`;
        if (plans.regular) $w('#regularPrice').text = `$${plans.regular.price}/year`;
        if (plans.couple) $w('#couplePrice').text = `$${plans.couple.price}/year`;
        if (plans.family) {
            $w('#familyPrice').text = `$${plans.family.price}/year`;
            if (plans.family.earlyBird) {
                $w('#earlyBirdBanner').text = 
                    `⏰ Early Bird Pricing! Family Premium $${plans.family.earlyBirdPrice} ` +
                    `(save $${plans.family.price - plans.family.earlyBirdPrice}) — Register by March 31, 2026`;
                $w('#earlyBirdBanner').show();
            }
        }
    } catch (err) {
        console.error("Plans load error:", err);
    }
}

function initMemberPortal() {
    $w('#btnLogin').onClick(() => {
        wixLocation.to('/member-login');
    });

    $w('#btnSignUp').onClick(() => {
        wixLocation.to('/member-signup');
    });
}

function initPlanSelection() {
    const plans = ['#studentPlan', '#regularPlan', '#couplePlan', '#familyPlan'];
    plans.forEach(planId => {
        try {
            $w(planId).onClick(() => {
                const planName = planId.replace('#', '').replace('Plan', '');
                wixLocation.to(`/membership/register?plan=${planName}`);
            });
        } catch (e) {}
    });
}
