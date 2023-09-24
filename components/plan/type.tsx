export interface Plan {
  title?: string | number;
  amount?: string;
  category?: string;
}

export const initialState: Plan = {
  title: 0,
  amount: "",
  category: "",
};
