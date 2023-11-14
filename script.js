// tracking-script.js

// Function to get user IP address
function getUserIpAddress() {
    return fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => data.ip)
      .catch((error) => {
        console.error('Error fetching IP address:', error);
        return null;
      });
  }
  
  // Function to set a cookie
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  
  // Function to get a cookie
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  // Function to parse URL parameters into an object
  function parseUrlParameters(url) {
    const paramString = url.split('?')[1];
    const queryString = new URLSearchParams(paramString);
    const urlObject = {};
  
    for (let pair of queryString.entries()) {
      urlObject[pair[0]] = pair[1];
    }
  
    return urlObject;
  }
  
  // Initialize the user's IP address
  let userIp = null;
  
  getUserIpAddress()
    .then((ip) => {
      userIp = ip;
  
      // Create the initial user cookie with the IP address
      const userCookie = getCookie('userCookie');
      if (!userCookie) {
        const initialUserCookie = {
          Id: generateUniqueUserID(),
          userIp: ip,
          interactions: [],
          domain: window.location.hostname, // Store domain
          userAgent: navigator.userAgent, // Store user agent
          trafficSource: '',
          urlData: parseUrlParameters(window.location.href),
          userId: '',
        };
  
        setCookie('userCookie', JSON.stringify(initialUserCookie), 365); // Set the cookie
      }
    })
    .catch((error) => {
      console.error('Error fetching IP address:', error);
    });
  
  // State to track user interactions
  const interactions = [];
  
  // Function to update the user's cookie with the latest interactions
  function updateUserCookieWithInteractions(interactions) {
    const userCookie = getCookie('userCookie');
  
    if (userCookie) {
      const userCookieData = JSON.parse(userCookie);
      userCookieData.interactions = interactions;
      setCookie('userCookie', JSON.stringify(userCookieData), 365);
    }
  }
  
  // Function to generate a unique user ID and store it in a cookie
  function generateUniqueUserID() {
    const cookieName = 'uniqueUserID';
  
    // Check if the user already has a unique ID stored in a cookie
    const existingUserID = getCookie(cookieName);
  
    if (existingUserID) {
      return existingUserID;
    }
  
    // Generate a new unique ID (you can use a library for this)
    const newUserID = generateRandomUniqueID();
  
    // Store the unique ID in a cookie (set the expiration date as needed)
    setCookie(cookieName, newUserID, 365); // 365 days, for example
  
    return newUserID;
  }
  
  // Function to set a cookie
  function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires;
  }
  
  // Function to get a cookie by name
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
  
  function generateRandomUniqueID() {
    const timestamp = new Date().getTime(); // Current timestamp
    const randomValue = (Math.random() * 2000) + 1; // Random number between 0 and 1
    const uniqueID = timestamp + '_' + randomValue;
  
    return uniqueID;
  }
  
  // Generate a unique user ID and store it in a variable for use
  const uniqueUserID = generateUniqueUserID();
  
  console.log('Unique User ID:', uniqueUserID);
  