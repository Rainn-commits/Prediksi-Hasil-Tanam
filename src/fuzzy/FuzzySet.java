package fuzzy;

public interface FuzzySet {
    double getMembership(double x);
}

class TrapezoidalMF implements FuzzySet {
    private final double a, b, c, d;

    public TrapezoidalMF(double a, double b, double c, double d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    
    @Override
    public double getMembership(double x) {
        if (x <= a || x >= d) {
            return 0.0;
        } else if (x >= b && x <= c) {
            return 1.0;
        } else if (x > a && x < b) {
            // Sisi kiri (linear naik)
            return (x - a) / (b - a);
        } else { // x > c && x < d
            // Sisi kanan (linear turun)
            return (d - x) / (d - c);
        }
    }
}

class GaussianMF implements FuzzySet {
    private final double m; 
    private final double sigma; 

    GaussianMF(double m, double sigma) {
        this.m = m;
        this.sigma = sigma;
    }

    @Override
    public double getMembership(double x) {
        return Math.exp(-0.5 * Math.pow((x - m) / sigma, 2));
    }
}