console.log('content.js is working 😀');

const videoPlayer = document.querySelector('video');

// Function to get sponsor segments from the API
async function getSponsorSegments(videoID) {
  const apiUrl = `https://sponsor.ajay.app/api/skipSegments?videoID=${videoID}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sponsor segments:', error);
    return [];
  }
}

// Function to check and skip sponsor segments
function checkAndSkipSegments(segments) {
  console.log('trying to skip segments');
  const currentTime = videoPlayer.currentTime;

  for (const segment of segments) {
    const startTime = segment.segment[0];
    const endTime = segment.segment[1];

    if (currentTime >= startTime && currentTime < endTime) {
      // Skip to the end of the sponsor segment
      videoPlayer.currentTime = endTime;
      console.log('Skipped sponsor segment:', { startTime, endTime });
      break;
    }
  }
}

// Main function to run the extension
async function runExtension() {
  // Get the video ID from the YouTube URL
  const videoID = new URL(window.location.href).searchParams.get('v');
  console.log(videoID, '🔗🔗🔗');

  if (!videoID) {
    console.error('Unable to extract video ID from URL.');
    return;
  }

  // Get sponsor segments for the video
  const sponsorSegments = await getSponsorSegments(videoID);

  console.log(sponsorSegments, sponsorSegments.length, '😂😂');

  // Check and skip segments periodically
  setInterval(() => {
    if (!videoPlayer.paused) {
      checkAndSkipSegments(sponsorSegments);
    }
  }, 1000); // Check every second
}

// Run the extension
runExtension();

// Listen for changes in the URL
let lastUrl = window.location.href;
new MutationObserver(() => {
  let url = window.location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // URL has changed, run the extension again
    runExtension();
  }
}).observe(document, { subtree: true, childList: true });

/* videoPlayer.addEventListener('timeupdate', function () {
  console.log(this.currentTime);
}); */
