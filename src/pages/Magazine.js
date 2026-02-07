// Magazine Page - Pratibimbo Digital Magazine
import wixLocation from 'wix-location';
import { getMagazineIssues, getMagazineIssue, getArticles } from 'backend/magazine.jsw';

$w.onReady(async function () {
    const urlParams = wixLocation.query;
    
    if (urlParams.issue) {
        await loadIssueDetails(urlParams.issue);
    } else {
        await loadMagazineIssues();
    }
});

async function loadMagazineIssues() {
    try {
        $w('#txtPageTitle').text = 'Pratibimbo Magazine';
        $w('#txtPageSubtitle').text = 'Our Community Digital Magazine';
        
        const issues = await getMagazineIssues();
        
        if ($w('#repeaterIssues').exists) {
            $w('#repeaterIssues').data = issues;
            $w('#repeaterIssues').onItemReady(($item, itemData) => {
                $item('#imgIssueCover').src = itemData.coverImage || 'https://static.wixstatic.com/media/magazine-cover.png';
                $item('#txtIssueTitle').text = itemData.title;
                $item('#txtIssueDate').text = formatDate(itemData.publishDate);
                $item('#txtIssueDesc').text = itemData.description || '';
                
                // Highlight latest issue
                if (itemData.isLatest) {
                    $item('#badgeLatest').show();
                } else {
                    $item('#badgeLatest').hide();
                }
                
                $item('#btnReadIssue').onClick(() => {
                    if (itemData.pdfUrl) {
                        // Open PDF in new tab
                        wixLocation.to(itemData.pdfUrl, { target: '_blank' });
                    } else {
                        wixLocation.to(`/magazine?issue=${itemData._id}`);
                    }
                });
                
                $item('#btnDownload').onClick(() => {
                    if (itemData.pdfUrl) {
                        wixLocation.to(itemData.pdfUrl, { target: '_blank' });
                    }
                });
            });
        }
        
        // Load featured articles
        await loadFeaturedArticles();
        
    } catch (e) {
        console.error('Error loading magazine issues:', e);
    }
}

async function loadIssueDetails(issueId) {
    try {
        const issue = await getMagazineIssue(issueId);
        
        $w('#txtPageTitle').text = issue.title;
        $w('#txtPageSubtitle').text = formatDate(issue.publishDate);
        
        // Show back button
        if ($w('#btnBackToIssues').exists) {
            $w('#btnBackToIssues').show();
            $w('#btnBackToIssues').onClick(() => {
                wixLocation.to('/magazine');
            });
        }
        
        // Display issue cover
        if ($w('#imgMainCover').exists) {
            $w('#imgMainCover').src = issue.coverImage;
        }
        
        // Load articles for this issue
        const articles = await getArticles(issueId);
        
        if ($w('#repeaterArticles').exists) {
            $w('#repeaterArticles').data = articles;
            $w('#repeaterArticles').onItemReady(($item, itemData) => {
                $item('#txtArticleTitle').text = itemData.title;
                $item('#txtArticleAuthor').text = `By ${itemData.author || 'BANF Team'}`;
                $item('#txtArticleExcerpt').text = itemData.excerpt || '';
                
                $item('#btnReadArticle').onClick(() => {
                    // Show article content in modal or expand
                    showArticleModal(itemData);
                });
            });
        }
        
        // Download button
        if ($w('#btnDownloadIssue').exists && issue.pdfUrl) {
            $w('#btnDownloadIssue').onClick(() => {
                wixLocation.to(issue.pdfUrl, { target: '_blank' });
            });
        }
        
    } catch (e) {
        console.error('Error loading issue:', e);
        wixLocation.to('/magazine');
    }
}

async function loadFeaturedArticles() {
    try {
        const articles = await getArticles(null, 5); // Get latest 5 articles
        
        if ($w('#repeaterFeaturedArticles').exists && articles.length > 0) {
            $w('#boxFeaturedArticles').show();
            $w('#repeaterFeaturedArticles').data = articles;
            $w('#repeaterFeaturedArticles').onItemReady(($item, itemData) => {
                $item('#txtFeaturedTitle').text = itemData.title;
                $item('#txtFeaturedAuthor').text = itemData.author || 'BANF Team';
            });
        }
    } catch (e) {
        console.log('Featured articles:', e.message);
    }
}

function showArticleModal(article) {
    if ($w('#modalArticle').exists) {
        $w('#txtModalTitle').text = article.title;
        $w('#txtModalAuthor').text = `By ${article.author || 'BANF Team'}`;
        $w('#txtModalContent').text = article.content || article.excerpt;
        $w('#modalArticle').show();
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
