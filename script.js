let port;
let reader;

async function connectSerial() {
  try {
    // 1. Port-Auswahl durch den Nutzer anfordern
    port = await navigator.serial.requestPort();

    // 2. Port mit spezifischen Parametern öffnen
    await port.open({ 
      baudRate: 115200, // Baudrate
      dataBits: 8,       // Standard: 8
      stopBits: 1,       // Standard: 1
      parity: "none",    // Standard: keine Parität
      bufferSize: 255    // Größe des Read-Buffers in Bytes
    });

    // 3. Streams verbinden: Binärdaten zu Text umwandeln und zeilenweise lesen
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const lineReader = textDecoder.readable.getReader();

    // 4. Lese-Schleife starten
    while (true) {
      const { value, done } = await lineReader.read();
      if (done) {
        // Stream wurde von außen abgebrochen/geschlossen
        lineReader.releaseLock();
        break;
      }
      if (value) {
        console.log("Empfangene Daten:", value);
      }
    }
  } catch (error) {
    console.error("Fehler bei der seriellen Verbindung:", error);
  }
}
