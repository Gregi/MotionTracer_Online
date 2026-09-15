function drawStandardLine(Plot, data) {
    Plotly.addTraces(Plot, {
        x: [0, 10], // X-Werte für die Linie
        y: [20, 20], // Y-Werte für die Linie (z.B. 20 cm)
    }, 1); // 1 ist der Index der neuen Spur

}