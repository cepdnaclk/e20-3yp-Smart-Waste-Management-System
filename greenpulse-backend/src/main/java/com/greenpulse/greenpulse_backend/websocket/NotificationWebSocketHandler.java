//package com.greenpulse.greenpulse_backend.websocket;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.greenpulse.greenpulse_backend.dto.NotificationDTO;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.*;
//
//import java.io.IOException;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class NotificationWebSocketHandler implements WebSocketHandler {
//
//    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        String userId = getUserIdFromSession(session);
//        if (userId != null) {
//            sessions.put(userId, session);
//            log.info("WebSocket connection established for user: {}", userId);
//        }
//    }
//
//    @Override
//    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
//        // Handle incoming messages if needed
//        log.debug("Received message: {}", message.getPayload());
//    }
//
//    @Override
//    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
//        log.error("WebSocket transport error: {}", exception.getMessage());
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
//        String userId = getUserIdFromSession(session);
//        if (userId != null) {
//            sessions.remove(userId);
//            log.info("WebSocket connection closed for user: {}", userId);
//        }
//    }
//
//    @Override
//    public boolean supportsPartialMessages() {
//        return false;
//    }
//
//    public void sendNotificationToUser(String userId, NotificationDTO notification) {
//        WebSocketSession session = sessions.get(userId);
//        if (session != null && session.isOpen()) {
//            try {
//                String message = objectMapper.writeValueAsString(notification);
//                session.sendMessage(new TextMessage(message));
//                log.debug("Sent notification to user {}: {}", userId, notification.getTitle());
//            } catch (IOException e) {
//                log.error("Failed to send notification to user {}: {}", userId, e.getMessage());
//                sessions.remove(userId); // Remove invalid session
//            }
//        }
//    }
//
//    private String getUserIdFromSession(WebSocketSession session) {
//        // Extract user ID from session attributes or query parameters
//        Map<String, Object> attributes = session.getAttributes();
//        Object userId = attributes.get("userId");
//
//        if (userId == null) {
//            // Try to get from query parameters
//            String query = session.getUri().getQuery();
//            if (query != null && query.contains("userId=")) {
//                String[] params = query.split("&");
//                for (String param : params) {
//                    if (param.startsWith("userId=")) {
//                        return param.substring(7);
//                    }
//                }
//            }
//        }
//
//        return userId != null ? userId.toString() : null;
//    }
//}
package com.greenpulse.greenpulse_backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenpulse.greenpulse_backend.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationWebSocketHandler implements WebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = getUsernameFromSession(session);
        if (username != null) {
            sessions.put(username, session);
            log.info("WebSocket connection established for username: {}", username);
        } else {
            log.warn("WebSocket connection rejected - no username provided");
            session.close();
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        // Handle incoming messages if needed
        log.debug("Received message: {}", message.getPayload());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket transport error: {}", exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        String username = getUsernameFromSession(session);
        if (username != null) {
            sessions.remove(username);
            log.info("WebSocket connection closed for username: {}", username);
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    // Updated method to use username instead of userId
    public void sendNotificationToUser(String username, NotificationDTO notification) {
        WebSocketSession session = sessions.get(username);
        if (session != null && session.isOpen()) {
            try {
                String message = objectMapper.writeValueAsString(notification);
                session.sendMessage(new TextMessage(message));
                log.debug("Sent notification to username {}: {}", username, notification.getTitle());
            } catch (IOException e) {
                log.error("Failed to send notification to username {}: {}", username, e.getMessage());
                sessions.remove(username); // Remove invalid session
            }
        } else {
            log.warn("No active WebSocket session found for username: {}", username);
        }
    }

    // Updated method to extract username from session
    private String getUsernameFromSession(WebSocketSession session) {
        // Extract username from session attributes or query parameters
        Map<String, Object> attributes = session.getAttributes();
        Object username = attributes.get("username");

        if (username == null) {
            // Try to get from query parameters (userId parameter contains username)
            String query = session.getUri().getQuery();
            if (query != null && query.contains("userId=")) {
                String[] params = query.split("&");
                for (String param : params) {
                    if (param.startsWith("userId=")) {
                        String extractedUsername = param.substring(7);
                        log.debug("Extracted username from query parameter: {}", extractedUsername);
                        return extractedUsername;
                    }
                }
            }
        }

        return username != null ? username.toString() : null;
    }

    // Helper method to get all active sessions (useful for debugging)
    public int getActiveSessionCount() {
        return sessions.size();
    }

    // Helper method to check if user is connected
    public boolean isUserConnected(String username) {
        WebSocketSession session = sessions.get(username);
        return session != null && session.isOpen();
    }
}
