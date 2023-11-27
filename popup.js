// const submitButton = document.getElementById('submitSegment');

// document.addEventListener("DOMContentLoaded", function() {
//   console.log('Tribit is running...');

//   // Send something to content.js
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {
//       something: "something tribit"
//     });
//   });
// });

// document.getElementById('submitSegment').addEventListener('click', function(event) {
//   event.preventDefault();

//   let startTime = document.getElementById('startTime').value;
//   let endTime = document.getElementById('endTime').value;

//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     let videoId = tabs[0].url.split('v=')[1];

//     let data = {
//       startTime: startTime,
//       endTime: endTime,
//       videoId: videoId
//     };

//     fetch('http://yourserver.com/submit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(data => console.log('Success:', data))
//     .catch((error) => console.error('Error:', error));

//     console.log(data);
//   });
// });
