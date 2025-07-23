import { create } from 'ipfs-http-client';

// IPFS configuration
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + Buffer.from(
      process.env.NEXT_PUBLIC_INFURA_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET
    ).toString('base64')
  }
});

export interface IPFSUploadResult {
  hash: string;
  size: number;
  path: string;
}

export class IPFSService {
  static async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to IPFS
      const result = await ipfs.add(buffer, {
        pin: true
      });

      return {
        hash: result.cid.toString(),
        size: result.size,
        path: result.path,
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  static async uploadMetadata(metadata: Record<string, unknown>): Promise<IPFSUploadResult> {
    try {
      const metadataString = JSON.stringify(metadata, null, 2);
      const buffer = Buffer.from(metadataString, 'utf-8');

      const result = await ipfs.add(buffer, {
        pin: true
      });

      return {
        hash: result.cid.toString(),
        size: result.size,
        path: result.path,
      };
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  static getGatewayURL(hash: string): string {
    // Use IPFS gateway to access files
    return `https://ipfs.io/ipfs/${hash}`;
  }

  static getInfuraGatewayURL(hash: string): string {
    // Use Infura gateway for faster access
    return `https://${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}.ipfs.infura-ipfs.io/ipfs/${hash}`;
  }

  static async validateFile(file: File): Promise<boolean> {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported. Please upload JPEG, PNG, GIF, or PDF');
    }

    return true;
  }

  static async uploadTicketWithMetadata(
    file: File, 
    metadata: Record<string, unknown>
  ): Promise<{ fileHash: string; metadataHash: string }> {
    try {
      // Validate file first
      await this.validateFile(file);

      // Upload file and metadata in parallel
      const [fileResult, metadataResult] = await Promise.all([
        this.uploadFile(file),
        this.uploadMetadata(metadata)
      ]);

      return {
        fileHash: fileResult.hash,
        metadataHash: metadataResult.hash,
      };
    } catch (error) {
      console.error('Error uploading ticket with metadata:', error);
      throw error;
    }
  }
}

// Fallback IPFS service using public gateways
export class FallbackIPFSService {
  static async uploadFile(file: File): Promise<IPFSUploadResult> {
    // For demo purposes, return a mock hash
    // In production, you would use a different IPFS service or fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: 'QmMockHash' + Math.random().toString(36).substr(2, 9),
          size: file.size,
          path: file.name,
        });
      }, 1000);
    });
  }

  static async uploadMetadata(metadata: Record<string, unknown>): Promise<IPFSUploadResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: 'QmMockMetadataHash' + Math.random().toString(36).substr(2, 9),
          size: JSON.stringify(metadata).length,
          path: 'ticket-metadata.json',
        });
      }, 500);
    });
  }

  static getGatewayURL(hash: string): string {
    return `https://ipfs.io/ipfs/${hash}`;
  }
}

// Export the appropriate service based on environment
export const IPFSServiceInstance = process.env.NODE_ENV === 'production' 
  ? IPFSService 
  : FallbackIPFSService; 