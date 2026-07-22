package Main;

import fuzzy.FuzzyInferenceSystem;
import java.util.Map;
import java.util.HashMap;
import java.sql.*;

public class Main {
    

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/soilplant_dataset"; 
    private static final String USER = "root"; 
    private static final String PASSWORD = "12389064"; 
    
    private static final String SQL_QUERY = "SELECT N, P, K, temperature, humidity, ph, rainfall FROM soil_data"; 

    public static void main(String[] args) {
        FuzzyInferenceSystem system = new FuzzyInferenceSystem();
        
        try (Connection conn = DriverManager.getConnection(JDBC_URL, USER, PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(SQL_QUERY)) 
        {
            System.out.println("--- Mulai Inferensi Data dari Database ---");
            int rowCount = 0;

            while (rs.next()) {
                rowCount++;
                
                Map<String, Double> inputData = new HashMap<>();
                inputData.put("N", rs.getDouble("N"));
                inputData.put("P", rs.getDouble("P"));
                inputData.put("K", rs.getDouble("K"));
                inputData.put("temperature", rs.getDouble("temperature"));
                inputData.put("humidity", rs.getDouble("humidity"));
                inputData.put("ph", rs.getDouble("ph"));
                inputData.put("rainfall", rs.getDouble("rainfall"));

                double predictedValue = system.infer(inputData);

                System.out.printf("\nRow %d (N: %.1f, P: %.1f, K: %.1f): \n", 
                                  rowCount, inputData.get("N"), inputData.get("P"), inputData.get("K"));
                System.out.printf("Nilai Prediksi Crisp: %.2f\n", predictedValue);
                
                if (predictedValue >= 2.5) {
                    System.out.println("Interpretasi: Hasil Tinggi (High Yield / Tanaman C)");
                } else if (predictedValue >= 1.5) {
                    System.out.println("Interpretasi: Hasil Sedang (Medium Yield / Tanaman B)");
                } else {
                    System.out.println("Interpretasi: Hasil Rendah (Low Yield / Tanaman A)");
                }
            }

            if (rowCount == 0) {
                System.out.println("Tidak ada data ditemukan di tabel yang dispesifikasikan.");
            }
            
        } catch (SQLException e) {
            System.err.println("--- ERROR KONEKSI DATABASE ---");
            System.err.println("Pastikan: 1. MySQL/MariaDB berjalan. 2. Driver JDBC sudah terpasang.");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error saat menjalankan inferensi:");
            e.printStackTrace();
        }
    }
}
