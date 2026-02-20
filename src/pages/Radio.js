// Radio.js
// BANF Radio 24/7 - Bengali & English Music

import wixLocation from 'wix-location';
import { getRadioSchedule, getNowPlaying } from 'backend/radio.jsw';

let isPlaying = false;

$w.onReady(async function () {
    console.log("📻 Radio page loading...");

    // Load schedule
    await loadSchedule();

    // Initialize player controls
    initPlayerControls();

    // Start now-playing updates
    startNowPlayingUpdates();

    console.log("✅ Radio page ready");
});

function initPlayerControls() {
    $w('#btnPlayPause').onClick(() => {
        isPlaying = !isPlaying;
        $w('#btnPlayPause').label = isPlaying ? '⏸ Pause' : '▶️ Play';
        // Audio playback handled via HTML embed or Wix Audio
    });

    $w('#btnLiveRadio').onClick(() => {
        // Switch to live stream tab
    });

    $w('#btnArchive').onClick(() => {
        // Switch to archive tab
    });

    $w('#btnYouTube').onClick(() => {
        wixLocation.to('https://youtube.com/@banfjacksonville');
    });

    $w('#btnSpotify').onClick(() => {
        wixLocation.to('https://open.spotify.com/show/banf');
    });
}

async function loadSchedule() {
    try {
        const schedule = await getRadioSchedule();
        // Populate schedule grid
    } catch (err) {
        console.error("Schedule load error:", err);
    }
}

async function startNowPlayingUpdates() {
    try {
        const current = await getNowPlaying();
        $w('#nowPlaying').text = current.title || 'BANF Radio - Live';
    } catch (err) {
        console.error("Now playing error:", err);
    }
}
