package model;

public class Plant {
    private String name;
    private String type; 

    public Plant(String name, String type) {
        this.name = name;
        this.type = type;
    }

    // Getter dan Setter
    public String getName() { return name; }
    public String getType() { return type; }
}
