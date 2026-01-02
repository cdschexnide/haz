export type State = {
  navigationRef: React.RefObject<any> | null;
};

export type Action = {
  type: "set-navigation-ref";
  payload: React.RefObject<any>;
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-navigation-ref":
      return { ...state, navigationRef: action.payload };
    default:
      return state;
  }
};

export const initialState: State = {
  navigationRef: null,
};
