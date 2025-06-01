package com.greenpulse.greenpulse_backend.config;


import com.greenpulse.greenpulse_backend.websocket.BinStatusWebSocketHandler;
import com.greenpulse.greenpulse_backend.websocket.JwtHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final BinStatusWebSocketHandler webSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    public WebSocketConfig(BinStatusWebSocketHandler webSocketHandler,
                           JwtHandshakeInterceptor jwtHandshakeInterceptor) {
        this.webSocketHandler = webSocketHandler;
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(webSocketHandler, "/ws/bin-status")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOrigins("*"); // In production, specify allowed origins (e.g., "https://yourapp.com")
    }
}
