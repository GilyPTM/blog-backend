export interface BasicContact {
  id: number;
}

export interface Contact extends BasicContact {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  dataadaugare?: Date;
}
