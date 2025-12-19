import {
    OrderStatus,
    DeliveryLocationUpdate,
    WSMessage,
} from '../types/order.types';

type MessageHandler = (message: WSMessage) => void;

interface WebSocketConnection {
    orderId: string;
    handlers: Set<MessageHandler>;
    intervalId: ReturnType<typeof setInterval> | null;
    isConnected: boolean;
}

// Simulated connections
const connections: Map<string, WebSocketConnection> = new Map();

// Simulated delivery partner path (for demo)
const deliveryPath = [
    { lat: 28.6315, lng: 77.2167 }, // Restaurant
    { lat: 28.6290, lng: 77.2150 },
    { lat: 28.6260, lng: 77.2130 },
    { lat: 28.6230, lng: 77.2110 },
    { lat: 28.6200, lng: 77.2100 },
    { lat: 28.6170, lng: 77.2095 },
    { lat: 28.6139, lng: 77.2090 }, // Customer
];

let currentPathIndex = 0;

export const WebSocketService = {
    /**
     * Connect to order tracking WebSocket
     * WS /orders/:id/track
     */
    connect: (orderId: string, onMessage: MessageHandler): void => {
        // Check for existing connection
        let connection = connections.get(orderId);

        if (connection) {
            connection.handlers.add(onMessage);
            return;
        }

        // Create new connection
        connection = {
            orderId,
            handlers: new Set([onMessage]),
            intervalId: null,
            isConnected: true,
        };

        connections.set(orderId, connection);

        console.log(`[WS] Connected to order tracking: ${orderId} `);

        // Start simulating updates
        WebSocketService.startSimulation(orderId);
    },

    /**
     * Disconnect from order tracking
     */
    disconnect: (orderId: string, handler?: MessageHandler): void => {
        const connection = connections.get(orderId);
        if (!connection) return;

        if (handler) {
            connection.handlers.delete(handler);
        }

        // If no more handlers, cleanup
        if (connection.handlers.size === 0 || !handler) {
            if (connection.intervalId) {
                clearInterval(connection.intervalId);
            }
            connection.isConnected = false;
            connections.delete(orderId);
            console.log(`[WS] Disconnected from order tracking: ${orderId} `);
        }
    },

    /**
     * Start simulating real-time updates
     */
    startSimulation: (orderId: string): void => {
        const connection = connections.get(orderId);
        if (!connection) return;

        // Reset path index
        currentPathIndex = 0;

        // Simulate location updates every 3 seconds
        connection.intervalId = setInterval(() => {
            if (!connection.isConnected) {
                if (connection.intervalId) clearInterval(connection.intervalId);
                return;
            }

            // Simulate location update
            if (currentPathIndex < deliveryPath.length) {
                const location = deliveryPath[currentPathIndex];
                const prevLocation = currentPathIndex > 0
                    ? deliveryPath[currentPathIndex - 1]
                    : location;

                // Calculate heading
                const heading = Math.atan2(
                    location.lng - prevLocation.lng,
                    location.lat - prevLocation.lat
                ) * (180 / Math.PI);

                const locationUpdate: DeliveryLocationUpdate = {
                    latitude: location.lat,
                    longitude: location.lng,
                    heading: heading,
                    speed: 25 + Math.random() * 10, // 25-35 km/h
                    timestamp: new Date().toISOString(),
                };

                WebSocketService.broadcastMessage(orderId, {
                    type: 'location_update',
                    orderId,
                    payload: locationUpdate,
                    timestamp: new Date().toISOString(),
                });

                // ETA update
                const remainingPoints = deliveryPath.length - currentPathIndex;
                const etaMinutes = remainingPoints * 2; // ~2 mins per point

                WebSocketService.broadcastMessage(orderId, {
                    type: 'eta_update',
                    orderId,
                    payload: {
                        minutes: etaMinutes,
                        distance: `${(remainingPoints * 0.5).toFixed(1)} km`,
                    },
                    timestamp: new Date().toISOString(),
                });

                currentPathIndex++;

                // Check if delivered
                if (currentPathIndex >= deliveryPath.length) {
                    WebSocketService.broadcastMessage(orderId, {
                        type: 'order_completed',
                        orderId,
                        payload: {
                            status: OrderStatus.DELIVERED,
                            deliveredAt: new Date().toISOString(),
                        },
                        timestamp: new Date().toISOString(),
                    });

                    // Stop simulation
                    if (connection.intervalId) {
                        clearInterval(connection.intervalId);
                    }
                }
            }
        }, 3000);
    },

    /**
     * Broadcast message to all handlers
     */
    broadcastMessage: (orderId: string, message: WSMessage): void => {
        const connection = connections.get(orderId);
        if (!connection) return;

        connection.handlers.forEach(handler => {
            try {
                handler(message);
            } catch (error) {
                console.error('[WS] Handler error:', error);
            }
        });
    },

    /**
     * Simulate order status change
     */
    simulateStatusChange: (orderId: string, newStatus: OrderStatus): void => {
        WebSocketService.broadcastMessage(orderId, {
            type: 'status_update',
            orderId,
            payload: {
                status: newStatus,
                timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Simulate delivery partner assignment
     */
    simulatePartnerAssignment: (orderId: string): void => {
        const partner = {
            id: 'dp_sim',
            name: 'Amit Singh',
            avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
            phoneNumber: '+91 98765 00000',
            rating: 4.9,
            vehicleType: 'bike' as const,
            vehicleNumber: 'DL 01 XY 5678',
            latitude: deliveryPath[0].lat,
            longitude: deliveryPath[0].lng,
        };

        WebSocketService.broadcastMessage(orderId, {
            type: 'partner_assigned',
            orderId,
            payload: partner,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Check if connected to order
     */
    isConnected: (orderId: string): boolean => {
        const connection = connections.get(orderId);
        return connection?.isConnected ?? false;
    },
};
