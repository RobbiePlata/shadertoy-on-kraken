let viewstate = 640;
if (window.nzxt !== undefined) {
    viewstate = window.nzxt.v1.height;
}
const params = new URL(window.location.href).searchParams;
const shader = params.get("shader") || "4XS3Rm"

const isKraken = params.get("kraken") === "1";
const krakenElement = document.getElementById("kraken");
const messageElement = document.getElementById("message");
const shaderContainerElement = document.getElementById("shadertoy-container");
const shaderElement = document.getElementById("shader");

krakenElement.style.width = viewstate + "px";
krakenElement.style.height = viewstate + "px";

const shaderContainerElementWidth = Math.ceil(viewstate * 16 / 9);
const leftOffset = (shaderContainerElementWidth - viewstate) / 2;

shaderContainerElement.style.width = shaderContainerElementWidth + "px";
shaderContainerElement.style.height = viewstate + "px";
shaderContainerElement.style.left = -leftOffset + "px";

krakenElement.style.display = isKraken ? "block" : "none";
messageElement.style.display = isKraken ? "none" : "block";

shaderElement.src = `https://www.shadertoy.com/embed/${shader}?gui=false&paused=false&muted=true`;

const processor = params.get("processor");

// Debug
window.onkeydown = function (e) {
    if (e.key === "ArrowUp") {
        if (!processor) return;
        const temperature = 50;
        const minTemperature = 0;
        const maxTemperature = 100;
        const normalized =
            (temperature - minTemperature) /
            (maxTemperature - minTemperature);
        animateGauge(normalized, previousNormalized);
        previousNormalized = normalized;
    }
};


const canvas = document.getElementById("canvas");
canvas.width = viewstate;
canvas.height = viewstate;

function drawGauge(normalizedTemperature) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width * 0.4;
    const gaugeAngle = normalizedTemperature * 2 * Math.PI;
    const startAngle = (2 * Math.PI) / 4;
    const endAngle = gaugeAngle + startAngle;

    ctx.moveTo(centerX, centerY);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = viewstate / 25;
    ctx.lineCap = "round";
    ctx.stroke();

    const temperature = Math.floor(normalizedTemperature * 100);
    ctx.fillStyle = "#fff";
    ctx.font = `${viewstate / 4}px 'Gotham Black', sans-serif`;
    ctx.fontWeight = "lighter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${temperature}`, centerX - viewstate / 25, centerY);

    ctx.font = `${viewstate / 8}px 'Gotham Black', sans-serif`;
    if (temperature < 10) {
        ctx.fillText(
            "°",
            centerX + viewstate / 12,
            centerY - viewstate / 20
        );
    } else if (temperature < 100) {
        ctx.fillText(
            "°",
            centerX + viewstate / 6,
            centerY - viewstate / 20
        );
    } else {
        ctx.fillText(
            "°",
            centerX + viewstate / 4,
            centerY - viewstate / 20
        );
    }
}

let animationId = null;
let previousNormalized = 0;

function animateGauge(currentNormalized, previousNormalized) {
    if (previousNormalized === currentNormalized) return;

    if (animationId) {
        window.cancelAnimationFrame(animationId);
    }

    const step = (currentNormalized - previousNormalized) / 15;

    function updateGauge() {
        previousNormalized += step;
        drawGauge(previousNormalized);

        if (
            (step > 0 && previousNormalized < currentNormalized) ||
            (step < 0 && previousNormalized > currentNormalized)
        ) {
            animationId = window.requestAnimationFrame(updateGauge);
        }
    }

    animationId = window.requestAnimationFrame(updateGauge);
}

window.nzxt = {
    v1: {
        onMonitoringDataUpdate: (pc) => {
            if (!processor) return;
            const processingUnit = processor === "gpu" ? pc.gpus[0] : pc.cpus[0];
            const temperature = Math.floor(processingUnit.temperature);
            const minTemperature = 0;
            const maxTemperature = 100;
            const normalized =
                (temperature - minTemperature) /
                (maxTemperature - minTemperature);
            animateGauge(normalized, previousNormalized);
            previousNormalized = normalized;
        },
    },
};