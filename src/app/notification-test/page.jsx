"use client"
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const VerificationStatus = () => {
    const [verificationStatus, setVerificationStatus] = useState('loading');
    const [notification, setNotification] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const userId = '6893cd76af20078257257206';


    useEffect(() => {
        const newSocket = io('https://app.dashaditt.app', {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            secure: true,
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            newSocket.emit('join_user_room', userId);
            console.log(`Joined room for user ${userId}`);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from WebSocket');
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setVerificationStatus('connection_error');
            setNotification({
                type: 'error',
                title: 'Connection Error',
                message: 'Failed to connect to verification service'
            });
        });

        const handleVerificationSuccess = (data) => {
            console.log('Verification success:', data);
            setVerificationStatus('verified');
            setNotification({
                type: 'success',
                title: 'Verified!',
                message: data.message || 'Your identity has been successfully verified.',
                details: data.details
            });
        };

        const handleVerificationRejected = (data) => {
            console.log('Verification rejected:', data);
            setVerificationStatus('rejected');
            setNotification({
                type: 'error',
                title: 'Verification Rejected',
                message: data.message || 'Your identity verification was rejected.',
                details: data.details
            });
        };

        const handleVerificationUpdate = (data) => {
            console.log('Verification update:', data);
            setVerificationStatus(data.status);
            setNotification({
                type: 'info',
                title: 'Verification Update',
                message: data.message || 'Your verification status has been updated.',
                details: data.details
            });
        };

        const handleVerificationPending = (data) => {
            console.log('Verification pending:', data);
            setVerificationStatus('pending');
            setNotification({
                type: 'warning',
                title: 'Pending Approval',
                message: data.message || 'Your verification is pending admin approval.',
                details: data.details
            });
        };

        newSocket.on('verification_success', handleVerificationSuccess);
        newSocket.on('verification_rejected', handleVerificationRejected);
        newSocket.on('verification_update', handleVerificationUpdate);
        newSocket.on('verification_pending', handleVerificationPending);

        return () => {
            if (newSocket) {
                newSocket.off('verification_success', handleVerificationSuccess);
                newSocket.off('verification_rejected', handleVerificationRejected);
                newSocket.off('verification_update', handleVerificationUpdate);
                newSocket.off('verification_pending', handleVerificationPending);
                newSocket.disconnect();
            }
        };
    }, [userId]);

    return (
        <div className="verification-status-container">
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            
            <div className={`status-badge ${verificationStatus}`}>
                Status: {verificationStatus}
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    {notification.details && (
                        <div className="details">
                            <pre>{JSON.stringify(notification.details, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerificationStatus;