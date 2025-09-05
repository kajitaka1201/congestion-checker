export type DatabaseType = {
  stores: {
    [key: string]: {
      desks: {
        [key: string]: DeskType;
      };
    };
  };
  users: {
    [key: string]: UserType;
  };
};

export type UserType = {
  storeId: string;
};

export type DeskType = {
  x: number; // x座標をパーセント形式で
  y: number; // y座標をパーセント形式で
  orientation: "horizontal" | "vertical";
  used: boolean;
};
