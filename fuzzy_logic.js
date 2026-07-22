const TrapezoidalMF = (x, a, b, c, d) => {
    if (x <= a || x >= d) return 0.0;
    if (x >= b && x <= c) return 1.0;
    if (x > a && x < b) return (x - a) / (b - a);
    return (d - x) / (d - c);
};

const GaussianMF = (x, m, sigma) =>
    Math.exp(-0.5 * Math.pow((x - m) / sigma, 2));

const inputFuzzySets = {
    N: {
        low: x => TrapezoidalMF(x, 0, 0, 50, 100),
        medium: x => TrapezoidalMF(x, 80, 100, 150, 170),
        high: x => TrapezoidalMF(x, 160, 200, 250, 250)
    },
    P: {
        low: x => TrapezoidalMF(x, 0, 0, 30, 60),
        medium: x => GaussianMF(x, 75, 15),
        high: x => TrapezoidalMF(x, 100, 120, 150, 150)
    },
    K: {
        low: x => TrapezoidalMF(x, 0, 0, 40, 80),
        medium: x => TrapezoidalMF(x, 60, 100, 140, 180),
        high: x => TrapezoidalMF(x, 160, 180, 200, 200)
    },
    ph: {
        acid: x => TrapezoidalMF(x, 0, 0, 5.5, 6.5),
        neutral: x => TrapezoidalMF(x, 6.0, 6.5, 7.5, 8.0),
        alkali: x => TrapezoidalMF(x, 7.5, 8.5, 14, 14)
    }
};

const ruleBase = [
    { conditions: { N: "high", P: "high", ph: "neutral" }, output: "high_yield" },
    { conditions: { N: "medium", K: "medium", ph: "neutral" }, output: "medium_yield" },
    { conditions: { N: "low", P: "low", K: "low", ph: "acid" }, output: "low_yield" }
];

const outputCentroids = {
    low_yield: 1.0,
    medium_yield: 2.0,
    high_yield: 3.0
};

const inferensiFuzzy = (inputMap) => {
    let outputFuzzified = {};

    ruleBase.forEach(rule => {
        let alpha = 1.0;
        for (const [v, t] of Object.entries(rule.conditions)) {
            alpha = Math.min(alpha, inputFuzzySets[v][t](inputMap[v]));
        }
        outputFuzzified[rule.output] =
            Math.max(outputFuzzified[rule.output] || 0, alpha);
    });

    let total = 0, sum = 0;
    for (const [term, alpha] of Object.entries(outputFuzzified)) {
        total += alpha * outputCentroids[term];
        sum += alpha;
    }
    return sum === 0 ? 0 : total / sum;
};

/* ================= INPUT MANUAL ================= */
document.getElementById("fuzzy-form").addEventListener("submit", e => {

    e.preventDefault();

    const input = {
        N: +N.value,
        P: +P.value,
        K: +K.value,
        temperature: +temperature.value,
        humidity: +humidity.value,
        ph: +ph.value,
        rainfall: +rainfall.value
    };

    const crisp = inferensiFuzzy(input);

    /* ===== NILAI AMBANG (0–1) ===== */
    const minOutput = 1.0;
    const maxOutput = 3.0;

    let confidence = (crisp - minOutput) / (maxOutput - minOutput);
    confidence = Math.max(0, Math.min(1, confidence));

    /* ===== INTERPRETASI YIELD ===== */
    let yieldLabel;
    if (crisp >= 2.5) {
        yieldLabel = "High Yield";
    } else if (crisp >= 1.5) {
        yieldLabel = "Medium Yield";
    } else {
        yieldLabel = "Low Yield";
    }

    /* ===== INTERPRETASI FUZZY (0–1) ===== */
    let fuzzyLevel;
    if (confidence >= 0.7) {
        fuzzyLevel = "High";
    } else if (confidence >= 0.4) {
        fuzzyLevel = "Medium";
    } else {
        fuzzyLevel = "Low";
    }

    /* ===== OUTPUT ===== */
    document.getElementById("crisp-value").innerHTML =
        `Crisp Output: <b>${crisp.toFixed(2)}</b>`;

    document.getElementById("interpretation").innerHTML =
        `Yield Category: <b>${yieldLabel}</b>`;

    document.getElementById("confidence").innerHTML =
        `Fuzzy Degree (0–1): <b>${confidence.toFixed(2)}</b> (${fuzzyLevel})`;
});

/* ================= DATASET REFERENSI (DISPLAY ONLY) ================= */

const datasetReferensi = [
  { "N": 91, "P": 94, "K": 46, "temperature": 29.36792366, "humidity": 76.24900101, "ph": 6.149934034, "rainfall": 92.82840911 },
  { "N": 40, "P": 16, "K": 35, "temperature": 34.16438906, "humidity": 54.16482251, "ph": 4.954739564, "rainfall": 98.33351125 },
  { "N": 24, "P": 130, "K": 195, "temperature": 29.99677232, "humidity": 81.54156612, "ph": 6.112305667, "rainfall": 67.12534492 },
  { "N": 119, "P": 25, "K": 51, "temperature": 26.47330219, "humidity": 80.92254421, "ph": 6.283818329, "rainfall": 53.65742581 },
  { "N": 60, "P": 55, "K": 50, "temperature": 25.182937, "humidity": 85.182937, "ph": 6.482937, "rainfall": 99.99999999 },
  { "N": 75, "P": 60, "K": 55, "temperature": 28.18392, "humidity": 80.18392, "ph": 6.58392, "rainfall": 99.99999999 },
  { "N": 80, "P": 58, "K": 60, "temperature": 30.29482, "humidity": 78.29482, "ph": 6.69482, "rainfall": 99.99999999 },
  { "N": 65, "P": 52, "K": 50, "temperature": 27.283947, "humidity": 76.283947, "ph": 6.483947, "rainfall": 99.99999999 },
  { "N": 85, "P": 57, "K": 60, "temperature": 22.294817, "humidity": 82.294817, "ph": 6.394817, "rainfall": 99.99999999 },
  { "N": 108, "P": 26, "K": 52, "temperature": 28.82629037, "humidity": 94.26765349, "ph": 6.201797639, "rainfall": 26.23838511 },
  { "N": 9, "P": 137, "K": 200, "temperature": 21.12152071, "humidity": 90.6878768, "ph": 5.636687393, "rainfall": 99.99999999 },
  { "N": 27, "P": 13, "K": 6, "temperature": 13.36050601, "humidity": 91.35608208, "ph": 7.335158382, "rainfall": 99.99999999 },
  { "N": 58, "P": 51, "K": 47, "temperature": 42.13473976, "humidity": 91.70445386, "ph": 6.757470637, "rainfall": 99.99999999 },
  { "N": 10, "P": 18, "K": 35, "temperature": 27.79797651, "humidity": 99.64573002, "ph": 6.381975465, "rainfall": 99.99999999 },
  { "N": 78, "P": 58, "K": 62, "temperature": 27.284937, "humidity": 82.294817, "ph": 6.583947, "rainfall": 99.99999999 },
  { "N": 85, "P": 60, "K": 65, "temperature": 29.293817, "humidity": 85.283847, "ph": 6.693847, "rainfall": 99.99999999 },
  { "N": 90, "P": 62, "K": 68, "temperature": 28.283947, "humidity": 80.274839, "ph": 6.783947, "rainfall": 99.99999999 },
  { "N": 95, "P": 65, "K": 70, "temperature": 30.283947, "humidity": 88.283947, "ph": 6.783947, "rainfall": 99.99999999 },
  { "N": 70, "P": 58, "K": 55, "temperature": 26.193847, "humidity": 76.193847, "ph": 6.583847, "rainfall": 99.99999999 },
  { "N": 88, "P": 63, "K": 68, "temperature": 29.293817, "humidity": 83.283847, "ph": 6.793817, "rainfall": 99.99999999 },
  { "N": 80, "P": 60, "K": 65, "temperature": 27.193847, "humidity": 78.274839, "ph": 6.682947, "rainfall": 99.99999999 },
  { "N": 92, "P": 66, "K": 71, "temperature": 30.293847, "humidity": 86.293847, "ph": 6.693847, "rainfall": 99.99999999 },
  { "N": 85, "P": 62, "K": 68, "temperature": 28.284837, "humidity": 82.284837, "ph": 6.783847, "rainfall": 99.99999999 },
  { "N": 100, "P": 70, "K": 75, "temperature": 31.284837, "humidity": 90.284837, "ph": 6.883847, "rainfall": 99.99999999 },
  { "N": 90, "P": 42, "K": 43, "temperature": 22.493021, "humidity": 80.239472, "ph": 6.482917, "rainfall": 99.99999999 },
  { "N": 70, "P": 30, "K": 40, "temperature": 25.392847, "humidity": 70.281946, "ph": 6.214783, "rainfall": 99.99999999 },
  { "N": 85, "P": 55, "K": 60, "temperature": 24.103928, "humidity": 75.203748, "ph": 6.814972, "rainfall": 99.99999999 },
  { "N": 60, "P": 45, "K": 50, "temperature": 20.38492, "humidity": 65.294817, "ph": 6.013284, "rainfall": 99.99999999 },
  { "N": 100, "P": 60, "K": 65, "temperature": 28.38492, "humidity": 85.294817, "ph": 6.593847, "rainfall": 99.99999999 },
  { "N": 95, "P": 58, "K": 70, "temperature": 27.193847, "humidity": 80.274839, "ph": 6.382947, "rainfall": 99.99999999 },
  { "N": 80, "P": 40, "K": 45, "temperature": 23.293847, "humidity": 70.293847, "ph": 6.613847, "rainfall": 99.99999999 },
  { "N": 65, "P": 35, "K": 38, "temperature": 19.184937, "humidity": 60.184937, "ph": 6.029384, "rainfall": 99.99999999 },
  { "N": 88, "P": 50, "K": 52, "temperature": 25.293847, "humidity": 75.293847, "ph": 6.492837, "rainfall": 99.99999999 },
  { "N": 72, "P": 46, "K": 49, "temperature": 26.293847, "humidity": 72.283947, "ph": 6.583947, "rainfall": 99.99999999 },
  { "N": 90, "P": 55, "K": 60, "temperature": 28.283947, "humidity": 78.283947, "ph": 6.883947, "rainfall": 99.99999999 },
  { "N": 66, "P": 42, "K": 40, "temperature": 21.283947, "humidity": 68.283947, "ph": 6.183947, "rainfall": 99.99999999 },
  { "N": 76, "P": 48, "K": 52, "temperature": 23.193847, "humidity": 70.193847, "ph": 6.393847, "rainfall": 99.99999999 },
  { "N": 85, "P": 57, "K": 61, "temperature": 27.294817, "humidity": 79.294817, "ph": 6.794817, "rainfall": 99.99999999 },
  { "N": 95, "P": 60, "K": 63, "temperature": 29.293817, "humidity": 82.293817, "ph": 6.893817, "rainfall": 99.99999999 },
  { "N": 75, "P": 55, "K": 58, "temperature": 25.193847, "humidity": 74.283947, "ph": 6.383847, "rainfall": 99.99999999 },
  { "N": 65, "P": 50, "K": 52, "temperature": 24.183947, "humidity": 70.183947, "ph": 6.483847, "rainfall": 99.99999999 },
  { "N": 70, "P": 45, "K": 48, "temperature": 23.193847, "humidity": 68.283947, "ph": 6.283847, "rainfall": 99.99999999 },
  { "N": 80, "P": 60, "K": 62, "temperature": 26.293847, "humidity": 78.283947, "ph": 6.583847, "rainfall": 99.99999999 },
  { "N": 85, "P": 58, "K": 60, "temperature": 27.294817, "humidity": 79.294817, "ph": 6.684817, "rainfall": 99.99999999 },
  { "N": 90, "P": 62, "K": 65, "temperature": 28.38492, "humidity": 80.294817, "ph": 6.593847, "rainfall": 99.99999999 },
  { "N": 68, "P": 55, "K": 57, "temperature": 25.28492, "humidity": 76.294817, "ph": 6.483847, "rainfall": 99.99999999 },
  { "N": 74, "P": 58, "K": 60, "temperature": 26.193847, "humidity": 77.183947, "ph": 6.583847, "rainfall": 99.99999999 },
  { "N": 72, "P": 54, "K": 56, "temperature": 25.283947, "humidity": 75.283947, "ph": 6.383947, "rainfall": 99.99999999 },
  { "N": 76, "P": 56, "K": 59, "temperature": 27.193847, "humidity": 79.274839, "ph": 6.483847, "rainfall": 99.99999999 }
]

window.addEventListener("load", () => {
    const tbody = document.getElementById("datasetResult");

    datasetReferensi.forEach((d, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${d.N}</td>
                <td>${d.P}</td>
                <td>${d.K}</td>
                <td>${d.temperature}</td>
                <td>${d.humidity}</td>
                <td>${d.ph}</td>
                <td>${d.rainfall}</td>
            </tr>
        `;
    });
});
