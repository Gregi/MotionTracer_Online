function drawStandardLine(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[20, 40]], // Y-Werte für die Linie (z.B. 20 cm)
    };
    console.log("Layout to standard");
    setStandardLayout(Plot);

    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
}

function drawLine1(Plot) {

    drawStandardLine(Plot);
    document.getElementById('myModal').close();
}

function drawLine2(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[40, 20]], // Y-Werte für die Linie (z.B. 20 cm)

    };

    console.log("Layout to standard");
    setStandardLayout(Plot);


    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}

function drawLine3(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[40, 40]], // Y-Werte für die Linie (z.B. 20 cm)

    };

    console.log("Layout to standard");
    setStandardLayout(Plot);


    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}

function drawLine4(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[40, 40]], // Y-Werte für die Linie (z.B. 20 cm)

    };

    console.log("Layout to standard");
    setStandardLayout(Plot);


    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}

function drawLine5(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[40, 40]], // Y-Werte für die Linie (z.B. 20 cm)

    };

    console.log("Layout to standard");
    setStandardLayout(Plot);


    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}

function drawLine6(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[40, 40]], // Y-Werte für die Linie (z.B. 20 cm)

    };

    console.log("Layout to standard");
    setStandardLayout(Plot);


    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}

function drawLine7(Plot) {

    const updatedata = {
        x: [[0, 10]], // X-Werte für die Linie
        y: [[40, 40]], // Y-Werte für die Linie (z.B. 20 cm)

    };

    console.log("Layout to standard");
    setStandardLayout(Plot);


    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}

function drawLine8(Plot) {

    console.log("Layout to standard");
    setStandardLayout(Plot);

    Plotly.relayout(Plot, { dragmode: 'drawopenpath' });
    console.log("Standardlinie wurde gezeichnet.");
    document.getElementById('myModal').close();
}


function drawLine9(Plot) {

    const updatedata = {
        x: [[]], // X-Werte für die Linie
        y: [[]], // Y-Werte für die Linie (z.B. 20 cm) 
    };

    Plotly.restyle(Plot, updatedata, [1]);
    console.log("Standardlinie wurde gezeichnet.");
    console.log(updatedata);
    document.getElementById('myModal').close();
}