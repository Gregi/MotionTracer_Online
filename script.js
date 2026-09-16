let port;
let reader;
let connectionStatus = "disconnected";
let keepReading = false; // Steuerung für die Leseschleif




let firstTimeStamp;
let TimeStampassigned = false;

//trace1 is always the data from the Arduino
let trace1 ={
  type: 'scatter',
  mode: 'lines',
  x: [],
  y: [],
  line: {color: 'blue'},
  showlegend: false
};
//trace2 is a line inside the plot 
let trace2 = {
  type: 'scatter',
  mode: 'lines',
  x: [],
  y: [],
  line: {color: 'red'},
  showlegend: false
};

let data = [trace1, trace2];

let buffer = '';
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

function generatePlot() {
  const layout = {
    xaxis: {
      title:{ text: "Zeit/[s]"
    }, range: [-3, 10],
    tickmode: 'array',
    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ticktext: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  shapes: [
    {
      type: 'rect',
      xref: 'x',
      yref: 'paper', // Reicht über die gesamte Höhe des Diagramms
      x0: -3,
      x1: 0,
      y0: 0,
      y1: 1,
      fillcolor: 'lightgray',
      opacity: 0.5,
      layer: 'below',
      line: {
        width: 0
      }
    }
  ],
    yaxis: { title: {text: "Position /[cm]"}, range: [0, 40] },
    legend: false,
};
Plotly.newPlot("myPlot", data, layout);
drawStandardLine(myPlot, data);
}

function startMeasurement() {
  if (connectionStatus === "connected") {
    console.log("Starting measurement...");
    keepReading = true;
    resetPlot();
    readSerialData();
  }
}

function updatePlot(x, y) {
  
  console.log("Updating plot with x:", x, "y:", y);
  Plotly.extendTraces("myPlot", {
    x: [[x-3]],
    y: [[y]],
  }, [0]);

}



    

function resetPlot() {
  // 1. Lokale Arrays leeren
  const updatedata = {
        x: [[]], 
        y: [[]], 
    };
  // Timestamps für die neue Messung zurücksetzen
  firstTimeStamp = null;
  TimeStampassigned = false;

  // Puffer leeren (falls noch alte Reste vorhanden sind)
  buffer = "";
  firstRead = true;



  Plotly.restyle  ("myPlot", updatedata,[0]); 
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
        if (firstRead === true) {
          firstRead = false;
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
              if (timeInSeconds < 13) {
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
    } finally {
      //if(reader){
      //  reader.releaseLock();
      //}
    }
  }
}

