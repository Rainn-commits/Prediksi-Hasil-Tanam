package model;

public class Soil {
    private double n;
    private double p;
    private double k;
    private double temperature;
    private double humidity;
    private double ph;
    private double rainfall;

    public Soil(double n, double p, double k, double temperature, double humidity, double ph, double rainfall) {
        this.n = n;
        this.p = p;
        this.k = k;
        this.temperature = temperature;
        this.humidity = humidity;
        this.ph = ph;
        this.rainfall = rainfall;
    }

    // Getter dan Setter
    public double getN() { return n; }
    public double getP() { return p; }
    public double getK() { return k; }
    public double getTemperature() { return temperature; }
    public double getHumidity() { return humidity; }
    public double getPh() { return ph; }
    public double getRainfall() { return rainfall; }
}
