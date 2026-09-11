
let port;
let reader;
let connectionStatus = "disconnected";
let keepReading = false; // Steuerung für die Leseschleif


let xValues = [];
let yValues = [];
let data = [{x:xValues, y:yValues, mode:"lines"}];

let firstTimeStamp;
let TimeStampassigned = false;


let buffer ='';
let firstRead = true;


generatePlot();

if (!('serial' in navigator)) {
      alert('Die Web Serial API wird von Ihrem Browser leider nicht unterstützt (nutze z.B. Chrome oder Edge).');
}


connectButton.addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  connectButton.innerText = "Connected";
  connectButton.disabled = true;
  connectionStatus = "connected";

  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);

  const inputStream = textDecoder.readable;
  reader = inputStream.getReader();
  } catch (error) {
    console.error("Error opening serial port:", error);
  }
});

navigator.serial.addEventListener("disconnect", (e) => {
  console.log("Device disconnected:", e);
  connectButton.innerText = "Connect to Arduino";
  connectButton.disabled = false;
  connectionStatus = "disconnected";
});

navigator.serial.addEventListener("connect", (e) => {
  console.log("Device connected:", e);
  connectButton.innerText = "Connected";
  connectButton.disabled = true;
  connectionStatus = "connected";
});

function generatePlot(){
  const layout = {
    title: "Bewegungsdiagramm",
    xaxis: { title: "Zeit (s)", range: [0, 10] },
    yaxis: { title: "Abstand (cm)", range: [0, 40] }
  };
  Plotly.newPlot("myPlot", data, layout);

}

function startMeasurement() {
  if (connectionStatus === "connected") {
    console.log("Starting measurement...");
    keepReading = true;
    resetPlot();
    readSerialData();
  }
}

function updatePlot(x, y){
  console.log("Updating plot with x:", x, "y:", y);
  Plotly.extendTraces("myPlot", {
    x: [[x]],
    y: [[y]]
  }, [0]);
}

function resetPlot() {
  // 1. Lokale Arrays leeren
  xValues = [];
  yValues = [];

  // 2. Timestamps für die neue Messung zurücksetzen
  firstTimeStamp = null;
  TimeStampassigned = false;

  // 3. Puffer leeren (falls noch alte Reste vorhanden sind)
  buffer = "";
  firstRead = true;

  // 4. Das Diagramm in Plotly neu mit leeren Daten zeichnen
  const resetData = [{ x: [], y: [], mode: "lines" }];
  const layout = {
    title: "Bewegungsdiagramm",
    xaxis: { title: "Zeit (s)", range: [0, 10] },
    yaxis: { title: "Abstand (cm)", range: [0, 40] }
  };

  Plotly.react("myPlot", resetData, layout);

  // Optional: Anzeige auf der Webseite leeren
  const messageElement = document.getElementById("message");
  if (messageElement) {
    messageElement.innerHTML = "";
  }

  console.log("Plot und Daten wurden zurückgesetzt.");
}


async function readSerialData() {
  const messageElement = document.getElementById("message");
  while (reader) {
    console.log("Reading serial data...");
    try {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }

      if (value) {
        buffer += value;
        let lines = buffer.split('\n');
        if(firstRead===true){
          firstRead=false;
          continue; // Überspringe die erste Zeile, die möglicherweise unvollständig ist
          
        }
        
        // Das letzte Element im Array ist eventuell unvollständig, 
        // daher bleibt es im Puffer für den nächsten Durchlauf
        buffer = lines.pop();

        for (const line of lines) {
          const trimmedLine = line.trim(); // Steuerzeichen (\r) entfernen
          const daten = trimmedLine.split(',');

          if (daten.length === 3) {
            const rawTime = parseFloat(daten[0]);
            const val1 = parseFloat(daten[1]);

            if (!isNaN(rawTime) && !isNaN(val1)) {
              if (!TimeStampassigned) {
                firstTimeStamp = rawTime;
                TimeStampassigned = true;
                console.log("First timestamp assigned:", firstTimeStamp);
              }

              const timeInSeconds = (rawTime - firstTimeStamp) / 1000;
              if(timeInSeconds < 10) {
                updatePlot(timeInSeconds, val1);
              }
              
              //messageElement.innerHTML += trimmedLine + "<br>";
            }
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Lesen des seriellen Streams:", error);
      break;
    }finally{
      //if(reader){
      //  reader.releaseLock();
      //}
    }
  }
}