package com.greenpulse.greenpulse_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import software.amazon.awssdk.crt.mqtt.MqttClientConnection;
import software.amazon.awssdk.iot.AwsIotMqttConnectionBuilder;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class MqttConfig {

    @Value("${mqtt.certificate.path}")
    private String certPath;

    @Value("${mqtt.private.key.path}")
    private String keyPath;

    @Value("${mqtt.ca.path}")
    private String caPath;

    @Value("${mqtt.endpoint}")
    private String endpoint;

    @Value("${mqtt.clientId}")
    private String clientId;

    @Value("${mqtt.port}")
    private int port;

    @Bean
    public MqttClientConnection mqttClientConnection() throws IOException {
        // Read certs directly from file paths
        File certFile = new File(certPath);
        File keyFile = new File(keyPath);
        File caFile = new File(caPath);

        try (AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilderFromPath(certFile.getAbsolutePath(), keyFile.getAbsolutePath())) {

            if (!caPath.isEmpty()) {
                builder.withCertificateAuthorityFromPath(null, caFile.getAbsolutePath());
            }

            builder.withClientId(clientId)
                    .withEndpoint(endpoint)
                    .withPort(port)
                    .withCleanSession(true)
                    .withProtocolOperationTimeoutMs(60000);

            return builder.build();
        }
    }

    private File createTempFileFromInputStream(InputStream inputStream, String prefix) throws IOException {
        File tempFile = File.createTempFile(prefix, ".pem");
        tempFile.deleteOnExit(); // Delete the file when the JVM exits

        // Copy the InputStream to the temporary file
        try (InputStream is = inputStream) {
            java.nio.file.Files.copy(is, tempFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }

        return tempFile;
    }
}