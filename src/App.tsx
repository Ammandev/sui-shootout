import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";
import WebApp from '@twa-dev/sdk';

function App() {
  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "build/Webgl.loader.js",
    dataUrl: "build/Webgl.data",
    frameworkUrl: "build/Webgl.framework.js",
    codeUrl: "build/Webgl.wasm",
  });

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to detect if the device is mobile
    function detectMobile() {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobileDetected = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
      setIsMobile(mobileDetected);

      // Send platform message to Unity
      const platform = mobileDetected ? "Mobile" : "PC";
      sendMessage("Data", "SetPlatform", platform);
    }

    // Function to get Telegram username
    function getTelegramUserData() {
      if (WebApp.initDataUnsafe.user) {
        const username = WebApp.initDataUnsafe.user.username || "Unknown";
        // Send username to Unity
        sendMessage("Data", "SetUsername", username);
      }
    }

    // Handle resizing and orientation changes
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsLandscape(window.innerWidth > window.innerHeight);
    }

    // Set up initial values
    detectMobile();
    getTelegramUserData();
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sendMessage]);

  return (
    <div className="App">
      {isMobile && !isLandscape ? (
        <div className="rotate-message">
          Please rotate your device to landscape mode for the best experience.
        </div>
      ) : (
        <Unity
          style={{
            width: `${windowDimensions.width}px`,
            height: `${windowDimensions.height}px`,
          }}
          unityProvider={unityProvider}
        />
      )}
    </div>
  );
}

export default App;
