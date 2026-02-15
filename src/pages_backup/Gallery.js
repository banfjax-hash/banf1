// Photo Gallery Page
import wixLocation from 'wix-location';
import { getAlbums, getPhotos, getPhotosByEvent } from 'backend/photo-gallery-service.jsw';

let currentAlbum = null;

$w.onReady(async function () {
    const urlParams = wixLocation.query;
    
    if (urlParams.album) {
        currentAlbum = urlParams.album;
        await loadAlbumPhotos(urlParams.album);
    } else if (urlParams.event) {
        await loadEventPhotos(urlParams.event);
    } else {
        await loadAlbums();
    }
});

async function loadAlbums() {
    try {
        $w('#txtPageTitle').text = 'Photo Gallery';
        $w('#btnBackToAlbums').hide();
        
        const albums = await getAlbums();
        
        if ($w('#repeaterAlbums').exists) {
            $w('#repeaterAlbums').show();
            $w('#repeaterAlbums').data = albums;
            $w('#repeaterAlbums').onItemReady(($item, itemData) => {
                $item('#imgAlbumCover').src = itemData.coverImage || 'https://static.wixstatic.com/media/gallery-placeholder.png';
                $item('#txtAlbumTitle').text = itemData.title;
                $item('#txtPhotoCount').text = `${itemData.photoCount || 0} photos`;
                $item('#txtAlbumDate').text = formatDate(itemData.date);
                
                $item('#boxAlbum').onClick(() => {
                    wixLocation.to(`/gallery?album=${itemData._id}`);
                });
            });
        }
        
        if ($w('#galleryPhotos').exists) {
            $w('#galleryPhotos').hide();
        }
    } catch (e) {
        console.error('Error loading albums:', e);
    }
}

async function loadAlbumPhotos(albumId) {
    try {
        const photos = await getPhotos(albumId);
        
        $w('#txtPageTitle').text = photos.albumTitle || 'Album Photos';
        $w('#btnBackToAlbums').show();
        $w('#btnBackToAlbums').onClick(() => {
            wixLocation.to('/gallery');
        });
        
        if ($w('#repeaterAlbums').exists) {
            $w('#repeaterAlbums').hide();
        }
        
        displayPhotos(photos.items || photos);
    } catch (e) {
        console.error('Error loading album photos:', e);
    }
}

async function loadEventPhotos(eventId) {
    try {
        const photos = await getPhotosByEvent(eventId);
        
        $w('#txtPageTitle').text = 'Event Photos';
        $w('#btnBackToAlbums').show();
        $w('#btnBackToAlbums').onClick(() => {
            wixLocation.to('/gallery');
        });
        
        if ($w('#repeaterAlbums').exists) {
            $w('#repeaterAlbums').hide();
        }
        
        displayPhotos(photos);
    } catch (e) {
        console.error('Error loading event photos:', e);
    }
}

function displayPhotos(photos) {
    if ($w('#galleryPhotos').exists) {
        $w('#galleryPhotos').show();
        
        const galleryItems = photos.map(photo => ({
            type: 'image',
            src: photo.url || photo.src,
            title: photo.caption || '',
            description: photo.description || ''
        }));
        
        $w('#galleryPhotos').items = galleryItems;
    }
    
    // Alternative: Use repeater for photos
    if ($w('#repeaterPhotos').exists) {
        $w('#repeaterPhotos').show();
        $w('#repeaterPhotos').data = photos;
        $w('#repeaterPhotos').onItemReady(($item, itemData) => {
            $item('#imgPhoto').src = itemData.url || itemData.src;
            $item('#txtCaption').text = itemData.caption || '';
            
            $item('#imgPhoto').onClick(() => {
                // Open lightbox
                if ($w('#lightboxPhoto').exists) {
                    $w('#lightboxPhotoImage').src = itemData.url || itemData.src;
                    $w('#lightboxPhoto').show();
                }
            });
        });
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
