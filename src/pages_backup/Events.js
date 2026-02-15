// Events Page - List and manage events
import wixLocation from 'wix-location';
import { getUpcomingEvents, getPastEvents, registerForEvent } from 'backend/events.jsw';

let allEvents = [];

$w.onReady(async function () {
    await loadEvents();
    setupFilters();
    setupSearch();
});

async function loadEvents() {
    try {
        $w('#loaderEvents').show();
        
        const [upcoming, past] = await Promise.all([
            getUpcomingEvents(50),
            getPastEvents(20)
        ]);
        
        allEvents = [...upcoming, ...past];
        displayEvents(upcoming);
        
        $w('#loaderEvents').hide();
    } catch (e) {
        console.error('Error loading events:', e);
        $w('#loaderEvents').hide();
    }
}

function displayEvents(events) {
    if ($w('#repeaterEvents').exists) {
        $w('#repeaterEvents').data = events;
        $w('#repeaterEvents').onItemReady(($item, itemData) => {
            $item('#imgEvent').src = itemData.image || 'https://static.wixstatic.com/media/placeholder.png';
            $item('#txtEventTitle').text = itemData.title;
            $item('#txtEventDate').text = formatDateTime(itemData.date);
            $item('#txtEventVenue').text = itemData.venue || 'TBD';
            $item('#txtEventPrice').text = itemData.price ? `$${itemData.price}` : 'Free';
            
            $item('#btnViewEvent').onClick(() => {
                wixLocation.to(`/event-details?id=${itemData._id}`);
            });
            
            $item('#btnRegister').onClick(async () => {
                try {
                    await registerForEvent(itemData._id);
                    $item('#btnRegister').label = 'Registered ✓';
                    $item('#btnRegister').disable();
                } catch (e) {
                    console.error('Registration error:', e);
                }
            });
        });
    }
}

function setupFilters() {
    if ($w('#dropdownFilter').exists) {
        $w('#dropdownFilter').options = [
            { label: 'All Events', value: 'all' },
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Past Events', value: 'past' },
            { label: 'Free Events', value: 'free' }
        ];
        
        $w('#dropdownFilter').onChange((event) => {
            const filter = event.target.value;
            let filtered = allEvents;
            
            const now = new Date();
            if (filter === 'upcoming') {
                filtered = allEvents.filter(e => new Date(e.date) >= now);
            } else if (filter === 'past') {
                filtered = allEvents.filter(e => new Date(e.date) < now);
            } else if (filter === 'free') {
                filtered = allEvents.filter(e => !e.price || e.price === 0);
            }
            
            displayEvents(filtered);
        });
    }
}

function setupSearch() {
    if ($w('#inputSearch').exists) {
        $w('#inputSearch').onInput((event) => {
            const query = event.target.value.toLowerCase();
            const filtered = allEvents.filter(e => 
                e.title.toLowerCase().includes(query) ||
                (e.description && e.description.toLowerCase().includes(query))
            );
            displayEvents(filtered);
        });
    }
}

function formatDateTime(dateStr) {
    if (!dateStr) return 'Date TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}
