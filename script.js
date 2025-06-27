console.log("Script is working!");

// Example: Dynamic year in footer
const footer = document.querySelector("footer");
const year = new Date().getFullYear();
footer.innerHTML = `© ${year} Braids and Roots · All rights reserved`;
