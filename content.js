// Create a link element for the CSS file
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.type = 'text/css';
linkElement.href = chrome.extension.getURL('content.css'); // Adjust the path if needed

// Append the link element to the document head
document.head.appendChild(linkElement);

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
      const skippedSegment = {
        start: formatTime(startTime),
        end: formatTime(endTime),
      };
      console.log('Skipped sponsor segment:', skippedSegment);
      break;
    }
  }
}

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = Math.floor(seconds % 60);

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (secs < 10) secs = '0' + secs;

  return `${hours}:${minutes}:${secs}`;
}

let intervalId;
// Main function to run the extension
async function runExtension() {
  console.log('running extension');
  const oldElement = document.getElementById('sponsorSegments-tribit');
  if (oldElement) {
    oldElement.remove();
    console.log('removed old element 👴👴👴');
  }

  if (intervalId) {
    console.log('cleared interval ⏲⏲');
    clearInterval(intervalId);
  }

  const videoID = new URL(window.location.href).searchParams.get('v');
  console.log(videoID, '🔗🔗🔗');

  if (!videoID) {
    console.error('Unable to extract video ID from URL.');
    return;
  }

  // Get sponsor segments for the video
  const sponsorSegments = await getSponsorSegments(videoID);

  console.log(sponsorSegments, sponsorSegments.length, '😂😂');

  // Create a <style> element
  let style = document.createElement('style');
  // Add your CSS to the <style> element
  style.textContent = `
    #sponsorSegments-tribit {
      top: 8px;
      position: absolute;
      color: #ffffffdb;
      left: 237px;
    }
    #sponsorSegments-tribit ul {
      font-size: 12px;
      list-style: none;
    }
  `;
  // Append the <style> element to the <head> of the document
  document.head.appendChild(style);

  // if there are sponsor segments, show them to the user
  if (sponsorSegments.length > 0) {
    const sponsorSegmentsElement = document.createElement('div');
    sponsorSegmentsElement.id = 'sponsorSegments-tribit';
    sponsorSegmentsElement.innerHTML = `
        <h2>Sponsor Segments ${sponsorSegments.length}</h2>
        <ul>
          ${sponsorSegments
            .slice(0, 3)
            .sort((a, b) => a.segment[0] - b.segment[0])
            .map(
              (segment) =>
                `<li>${formatTime(segment.segment[0])} - ${formatTime(
                  segment.segment[1]
                )}</li>`
            )
            .join('')}
        </ul>
      `;
    document.body.appendChild(sponsorSegmentsElement);
  }

  // Check and skip segments periodically
  intervalId = setInterval(() => {
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
