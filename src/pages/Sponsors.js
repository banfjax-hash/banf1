// Sponsors Page
import wixLocation from 'wix-location';
import { getActiveSponsors, getSponsorsByTier, getSponsorDetails } from 'backend/sponsor-management.jsw';

$w.onReady(async function () {
    await loadSponsors();
    setupSponsorshipInfo();
});

async function loadSponsors() {
    try {
        // Load sponsors by tier
        const [platinum, gold, silver, bronze] = await Promise.all([
            getSponsorsByTier('platinum'),
            getSponsorsByTier('gold'),
            getSponsorsByTier('silver'),
            getSponsorsByTier('bronze')
        ]);
        
        // Display Platinum sponsors (featured)
        if ($w('#repeaterPlatinum').exists && platinum.length > 0) {
            $w('#sectionPlatinum').show();
            $w('#repeaterPlatinum').data = platinum;
            $w('#repeaterPlatinum').onItemReady(($item, itemData) => {
                setupSponsorItem($item, itemData, 'platinum');
            });
        }
        
        // Display Gold sponsors
        if ($w('#repeaterGold').exists && gold.length > 0) {
            $w('#sectionGold').show();
            $w('#repeaterGold').data = gold;
            $w('#repeaterGold').onItemReady(($item, itemData) => {
                setupSponsorItem($item, itemData, 'gold');
            });
        }
        
        // Display Silver sponsors
        if ($w('#repeaterSilver').exists && silver.length > 0) {
            $w('#sectionSilver').show();
            $w('#repeaterSilver').data = silver;
            $w('#repeaterSilver').onItemReady(($item, itemData) => {
                setupSponsorItem($item, itemData, 'silver');
            });
        }
        
        // Display Bronze sponsors
        if ($w('#repeaterBronze').exists && bronze.length > 0) {
            $w('#sectionBronze').show();
            $w('#repeaterBronze').data = bronze;
            $w('#repeaterBronze').onItemReady(($item, itemData) => {
                setupSponsorItem($item, itemData, 'bronze');
            });
        }
        
    } catch (e) {
        console.error('Error loading sponsors:', e);
    }
}

function setupSponsorItem($item, itemData, tier) {
    $item('#imgSponsorLogo').src = itemData.logo || 'https://static.wixstatic.com/media/sponsor-placeholder.png';
    $item('#txtSponsorName').text = itemData.companyName;
    
    // Show description for higher tiers
    if ((tier === 'platinum' || tier === 'gold') && $item('#txtSponsorDesc').exists) {
        $item('#txtSponsorDesc').text = itemData.description || '';
        $item('#txtSponsorDesc').show();
    }
    
    // Click handler to visit sponsor website
    $item('#boxSponsor').onClick(() => {
        if (itemData.website) {
            wixLocation.to(itemData.website, { target: '_blank' });
        }
    });
}

function setupSponsorshipInfo() {
    // Sponsorship packages info
    const packages = [
        {
            tier: 'Platinum',
            price: '$5,000+',
            benefits: [
                'Logo on all event materials',
                'Featured on website homepage',
                'Social media recognition',
                'VIP event access',
                'Magazine full-page ad'
            ]
        },
        {
            tier: 'Gold',
            price: '$2,500',
            benefits: [
                'Logo on event banners',
                'Website sponsor page',
                'Social media mentions',
                'Event tickets',
                'Magazine half-page ad'
            ]
        },
        {
            tier: 'Silver',
            price: '$1,000',
            benefits: [
                'Logo on event programs',
                'Website listing',
                'Newsletter mention',
                'Event tickets'
            ]
        },
        {
            tier: 'Bronze',
            price: '$500',
            benefits: [
                'Website listing',
                'Event recognition',
                'Newsletter mention'
            ]
        }
    ];
    
    if ($w('#repeaterPackages').exists) {
        $w('#repeaterPackages').data = packages.map((p, i) => ({ ...p, _id: String(i) }));
        $w('#repeaterPackages').onItemReady(($item, itemData) => {
            $item('#txtTierName').text = itemData.tier;
            $item('#txtTierPrice').text = itemData.price;
            $item('#txtTierBenefits').text = itemData.benefits.join('\n• ');
            
            $item('#btnBecomeSponsor').onClick(() => {
                wixLocation.to('/contact?subject=Sponsorship&tier=' + itemData.tier);
            });
        });
    }
    
    // Become a sponsor button
    if ($w('#btnContactSponsor').exists) {
        $w('#btnContactSponsor').onClick(() => {
            wixLocation.to('/contact?subject=Sponsorship%20Inquiry');
        });
    }
}
