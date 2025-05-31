package com.greenpulse.greenpulse_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GreenpulseBackendApplication {

	public static void main(String[] args) {
		// Load .env, ignore if missing
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		// Set DB environment variables
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME", ""));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD", ""));
		System.setProperty("DB_HOST", dotenv.get("DB_HOST", "localhost"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME", ""));

		// Set JWT secret
		System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET", ""));

		// Set MQTT variables
		System.setProperty("MQTT_CERT_PATH", dotenv.get("MQTT_CERT_PATH", ""));
		System.setProperty("MQTT_PRIVATE_KEY_PATH", dotenv.get("MQTT_PRIVATE_KEY_PATH", ""));
		System.setProperty("MQTT_CA_PATH", dotenv.get("MQTT_CA_PATH", ""));
		System.setProperty("MQTT_ENDPOINT", dotenv.get("MQTT_ENDPOINT", ""));
		System.setProperty("MQTT_CLIENT_ID", dotenv.get("MQTT_CLIENT_ID", ""));
		System.setProperty("MQTT_TOPIC", dotenv.get("MQTT_TOPIC", ""));
		System.setProperty("MQTT_PORT", dotenv.get("MQTT_PORT", ""));

		System.setProperty("MAIL_USERNAME", dotenv.get("MAIL_USERNAME", ""));
		System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD", ""));

		SpringApplication.run(GreenpulseBackendApplication.class, args);
	}
}

