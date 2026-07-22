package fuzzy;

import java.util.HashMap;
import java.util.Map;

public class FuzzyInferenceSystem {

    /* ================= MEMBERSHIP FUNCTIONS ================= */

    private double trapezoidalMF(double x, double a, double b, double c, double d) {
        if (x <= a || x >= d) return 0.0;
        if (x >= b && x <= c) return 1.0;
        if (x > a && x < b) return (x - a) / (b - a);
        return (d - x) / (d - c);
    }

    private double gaussianMF(double x, double m, double sigma) {
        return Math.exp(-0.5 * Math.pow((x - m) / sigma, 2));
    }

    /* ================= FUZZY SETS ================= */

    private Map<String, Map<String, MF>> inputFuzzySets = new HashMap<>();

    private interface MF {
        double apply(double x);
    }

    public FuzzyInferenceSystem() {

        // N
        inputFuzzySets.put("N", Map.of(
            "low", x -> trapezoidalMF(x, 0, 0, 50, 100),
            "medium", x -> trapezoidalMF(x, 80, 100, 150, 170),
            "high", x -> trapezoidalMF(x, 160, 200, 250, 250)
        ));

        // P
        inputFuzzySets.put("P", Map.of(
            "low", x -> trapezoidalMF(x, 0, 0, 30, 60),
            "medium", x -> gaussianMF(x, 75, 15),
            "high", x -> trapezoidalMF(x, 100, 120, 150, 150)
        ));

        // K
        inputFuzzySets.put("K", Map.of(
            "low", x -> trapezoidalMF(x, 0, 0, 40, 80),
            "medium", x -> trapezoidalMF(x, 60, 100, 140, 180),
            "high", x -> trapezoidalMF(x, 160, 180, 200, 200)
        ));

        // pH
        inputFuzzySets.put("ph", Map.of(
            "acid", x -> trapezoidalMF(x, 0, 0, 5.5, 6.5),
            "neutral", x -> trapezoidalMF(x, 6.0, 6.5, 7.5, 8.0),
            "alkali", x -> trapezoidalMF(x, 7.5, 8.5, 14, 14)
        ));
    }

    /* ================= RULE BASE ================= */

    private Object[][] ruleBase = {
        { Map.of("N", "high", "P", "high", "ph", "neutral"), "high_yield" },
        { Map.of("N", "low", "P", "low", "K", "low", "ph", "acid"), "low_yield" },
        { Map.of("N", "medium", "K", "medium", "ph", "neutral"), "medium_yield" }
    };

    private Map<String, Double> outputCentroids = Map.of(
        "low_yield", 1.0,
        "medium_yield", 2.0,
        "high_yield", 3.0,
        "tropical_yield", 4.0,
        "dry_tolerant_yield", 5.0
    );

    /* ================= INFERENCE ================= */

    public double infer(Map<String, Double> inputMap) {

        Map<String, Double> outputFuzzified = new HashMap<>();

        for (Object[] rule : ruleBase) {
            Map<String, String> conditions = (Map<String, String>) rule[0];
            String output = (String) rule[1];

            double alpha = 1.0;

            for (Map.Entry<String, String> cond : conditions.entrySet()) {
                String var = cond.getKey();
                String term = cond.getValue();

                double x = inputMap.get(var);
                double dom = inputFuzzySets.get(var).get(term).apply(x);
                alpha = Math.min(alpha, dom);
            }

            outputFuzzified.put(
                output,
                Math.max(outputFuzzified.getOrDefault(output, 0.0), alpha)
            );
        }

        double totalWeighted = 0.0;
        double totalAlpha = 0.0;

        for (Map.Entry<String, Double> e : outputFuzzified.entrySet()) {
            double centroid = outputCentroids.get(e.getKey());
            totalWeighted += e.getValue() * centroid;
            totalAlpha += e.getValue();
        }

        if (totalAlpha == 0.0) return 0.0;
        return totalWeighted / totalAlpha;
    }
}
