// src/utils/remoteApiService.ts

import { Injectable } from '@snap/camera-kit';
import type { RemoteApiRequestHandler, RemoteApiRequest, RemoteApiServices, RemoteApiStatus } from '@snap/camera-kit';

// Recording Control API
const recordingControlService = {
  apiSpecId: '554881fc-8ced-405b-bfea-f229c5dd9a4f',
  getRequestHandler(request: RemoteApiRequest): RemoteApiRequestHandler | undefined {
    const { endpointId } = request;
    
    if (endpointId === 'start_recording') {
      return (reply) => {
        try {
          const scene = request.parameters.scene || 'unknown';
          console.log(`🎬 Recording started for scene: ${scene}`);
          
          // Generate a unique recording ID
          const recordingId = `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          
          // Return success response with recording ID
          reply({
            status: 'success' as RemoteApiStatus,
            metadata: {},
            body: new TextEncoder().encode(JSON.stringify({
              success: true,
              recording_id: recordingId,
              message: `Recording started for scene: ${scene}`
            }))
          });
        } catch (error) {
          console.error('Recording start error:', error);
          reply({
            status: 'error' as RemoteApiStatus,
            metadata: { error: String(error) },
            body: new TextEncoder().encode(JSON.stringify({
              success: false,
              error: 'Failed to start recording'
            }))
          });
        }
      };
    }
    
    if (endpointId === 'stop_recording') {
      return (reply) => {
        try {
          const scene = request.parameters.scene || 'unknown';
          const recordingId = request.parameters.recording_id || 'unknown';
          const score = request.parameters.score || '0';
          
          console.log(`⏹️ Recording stopped for scene: ${scene}`);
          console.log(`📊 Recording data: ID=${recordingId}, Score=${score}`);
          
          // Return success response
          reply({
            status: 'success' as RemoteApiStatus,
            metadata: {},
            body: new TextEncoder().encode(JSON.stringify({
              success: true,
              recording_id: recordingId,
              message: `Recording stopped for scene: ${scene}`,
              score: score
            }))
          });
        } catch (error) {
          console.error('Recording stop error:', error);
          reply({
            status: 'error' as RemoteApiStatus,
            metadata: { error: String(error) },
            body: new TextEncoder().encode(JSON.stringify({
              success: false,
              error: 'Failed to stop recording'
            }))
          });
        }
      };
    }
    
    return undefined;
  }
};

// Hadiah Status API
const hadiahStatusService = {
  apiSpecId: '1449890e-5eed-4797-8be9-8941ad055157',
  getRequestHandler(request: RemoteApiRequest): RemoteApiRequestHandler | undefined {
    const { endpointId } = request;
    
    if (endpointId === 'get_hadiah_status') {
      return (reply) => {
        try {
          // Mock data - in a real application, this would come from a database or external API
          const hadiahData = {
            available: true,  // Set to false when prizes are depleted
            stock_count: 25,
            last_updated: new Date().toISOString()
          };
          
          console.log('📦 Hadiah status requested:', hadiahData);
          
          // Return success response
          reply({
            status: 'success' as RemoteApiStatus,
            metadata: {},
            body: new TextEncoder().encode(JSON.stringify(hadiahData))
          });
        } catch (error) {
          console.error('Hadiah status error:', error);
          reply({
            status: 'error' as RemoteApiStatus,
            metadata: { error: String(error) },
            body: new TextEncoder().encode(JSON.stringify({
              success: false,
              error: 'Failed to get hadiah status'
            }))
          });
        }
      };
    }
    
    return undefined;
  }
};

// Function to get all Remote API services
export const getRemoteApiServices = (existingServices: RemoteApiServices = []): RemoteApiServices => {
  return [...existingServices, recordingControlService, hadiahStatusService];
};

// Injectable factory for Camera Kit
export const remoteApiServicesFactory = {
  token: Symbol.for('RemoteApiServices'),
  create: () => getRemoteApiServices()
};

// Export for direct use
export default {
  recordingControlService,
  hadiahStatusService,
  getRemoteApiServices
};