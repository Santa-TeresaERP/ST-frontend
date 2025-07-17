export interface CashSessionAttributes {
  id?: string;
  user_id: number;
  store_id: number;
  start_amount: number;
  end_amount: number;
  total_returns: number;
  ended_at: string | Date;
}