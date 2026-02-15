// Radio Page - BANF Community Radio
import wixLocation from 'wix-location';
import { getStreamStatus, getSchedule, getCurrentShow, getUpcomingShows } from 'backend/streaming-service.jsw';
import { getRadioSchedule, getRadioShows } from 'backend/radio-scheduler.jsw';

let audioPlayer = null;
let isPlaying = false;

$w.onReady(async function () {
    await initializeRadio();
    await loadSchedule();
    setupPlayerControls();
});

async function initializeRadio() {
    try {
        // Check stream status
        const status = await getStreamStatus();
        
        if (status.isLive) {
            $w('#txtLiveStatus').text = '🔴 LIVE NOW';
            $w('#txtLiveStatus').show();
            
            // Get current show info
            const currentShow = await getCurrentShow();
            if (currentShow) {
                $w('#txtCurrentShow').text = currentShow.title;
                $w('#txtCurrentHost').text = `Hosted by ${currentShow.host || 'BANF Radio'}`;
            }
        } else {
            $w('#txtLiveStatus').text = 'Currently Off Air';
            $w('#txtCurrentShow').text = 'Check schedule for upcoming shows';
        }
        
        // Set stream URL
        if ($w('#audioPlayer').exists && status.streamUrl) {
            $w('#audioPlayer').src = status.streamUrl;
        }
        
    } catch (e) {
        console.error('Error initializing radio:', e);
        $w('#txtLiveStatus').text = 'Radio Offline';
    }
}

async function loadSchedule() {
    try {
        const schedule = await getRadioSchedule();
        
        if ($w('#repeaterSchedule').exists && schedule.length > 0) {
            $w('#repeaterSchedule').data = schedule;
            $w('#repeaterSchedule').onItemReady(($item, itemData) => {
                $item('#txtShowDay').text = itemData.day;
                $item('#txtShowTime').text = formatTime(itemData.startTime) + ' - ' + formatTime(itemData.endTime);
                $item('#txtShowName').text = itemData.showName;
                $item('#txtShowHost').text = itemData.host || '';
                
                // Highlight if currently live
                const now = new Date();
                if (isShowLive(itemData, now)) {
                    $item('#boxShowItem').style.backgroundColor = '#e8f5e9';
                    $item('#badgeLive').show();
                } else {
                    $item('#badgeLive').hide();
                }
            });
        }
        
        // Load upcoming shows
        const upcoming = await getUpcomingShows(5);
        if ($w('#repeaterUpcoming').exists && upcoming.length > 0) {
            $w('#repeaterUpcoming').data = upcoming;
            $w('#repeaterUpcoming').onItemReady(($item, itemData) => {
                $item('#txtUpcomingShow').text = itemData.showName;
                $item('#txtUpcomingTime').text = formatDateTime(itemData.nextAirDate);
            });
        }
        
    } catch (e) {
        console.error('Error loading schedule:', e);
    }
}

function setupPlayerControls() {
    // Play/Pause button
    if ($w('#btnPlayPause').exists) {
        $w('#btnPlayPause').onClick(() => {
            if (isPlaying) {
                pauseStream();
            } else {
                playStream();
            }
        });
    }
    
    // Volume control
    if ($w('#sliderVolume').exists) {
        $w('#sliderVolume').onChange((event) => {
            if ($w('#audioPlayer').exists) {
                $w('#audioPlayer').volume = event.target.value / 100;
            }
        });
    }
    
    // Mute button
    if ($w('#btnMute').exists) {
        $w('#btnMute').onClick(() => {
            if ($w('#audioPlayer').exists) {
                $w('#audioPlayer').muted = !$w('#audioPlayer').muted;
                $w('#btnMute').label = $w('#audioPlayer').muted ? '🔇' : '🔊';
            }
        });
    }
}

function playStream() {
    if ($w('#audioPlayer').exists) {
        $w('#audioPlayer').play();
        isPlaying = true;
        $w('#btnPlayPause').label = '⏸️ Pause';
        $w('#imgPlayingAnimation').show();
    }
}

function pauseStream() {
    if ($w('#audioPlayer').exists) {
        $w('#audioPlayer').pause();
        isPlaying = false;
        $w('#btnPlayPause').label = '▶️ Play';
        $w('#imgPlayingAnimation').hide();
    }
}

function isShowLive(show, now) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];
    
    if (show.day !== currentDay) return false;
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseTime(show.startTime);
    const endMinutes = parseTime(show.endTime);
    
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}
