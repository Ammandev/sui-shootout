import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/TrumpRunner.loader.js",
    dataUrl: "build/TrumpRunner.data",
    frameworkUrl: "build/TrumpRunner.framework.js",
    codeUrl: "build/TrumpRunner.wasm",
  });

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="App">
      <Unity
        style={{
          width: `${windowDimensions.width}px`,
          height: `${windowDimensions.height}px`,
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
}

export default App;
