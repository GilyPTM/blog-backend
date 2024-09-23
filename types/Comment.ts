export interface BasicComment {
  id: number;
}

export interface Comment extends BasicComment {
  text?: string;
  post_id?: Date;
  user_id?: number;
  nume?: string;
  prenume?: string;
}
