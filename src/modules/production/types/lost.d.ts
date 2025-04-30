interface LostAttributes {
    id: string;
    product_id: string;
    quantity: number;
    lost_type: string;
    observations?: string | null;
    created_at: Date;
  }
  
  interface LostCreationAttributes {
    product_id: string;
    quantity: number;
    lost_type: string;
    observations?: string | null;
    created_at?: Date | string;
  }
  
  interface LostUpdateAttributes {
    product_id?: string;
    quantity?: number;
    lost_type?: string;
    observations?: string | null;
    created_at?: Date | string;
  }
  
  // Tipos para respuestas API
  interface LostResponse {
    success: boolean;
    data?: LostAttributes;
    error?: string;
  }
  
  interface LostListResponse {
    success: boolean;
    data: LostAttributes[];
    count?: number;
  }
  
  export {
    LostAttributes,
    LostCreationAttributes,
    LostUpdateAttributes,
    LostResponse,
    LostListResponse
  };