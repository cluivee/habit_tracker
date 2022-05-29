import React from "react";
import  './SimpleHTMLSidebarTest.css';

// From: https://www.w3schools.com/howto/howto_js_collapse_sidepanel.asp

const SimpleHTMLSidebarTest = () => {
    function openNav() {
        document.getElementById("mySidepanel").style.width = "250px";
      }
      
      /* Set the width of the sidebar to 0 (hide it) */
      function closeNav() {
        document.getElementById("mySidepanel").style.width = "0";
      }

  return (
    <div>
      <div id="mySidepanel" class="sidepanel">
        <a href="javascript:void(0)" class="closebtn" onClick={closeNav}>
          &times;
        </a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </div>

      <button class="openbtn" onClick={openNav}>
        &#9776; Toggle Sidepanel
      </button>
      <h2>Collapsed Sidepanel</h2>
      <p>Click on the hamburger menu/bar icon to open the sidebar, and push this content to the right.</p>
    </div>
  );
};

export default SimpleHTMLSidebarTest;
