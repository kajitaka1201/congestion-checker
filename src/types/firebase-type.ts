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
  /**
   * x座標 (コンテナ幅に対するパーセンテージ, 0-100)
   */
  x: number;
  /**
   * y座標 (コンテナ高さに対するパーセンテージ, 0-100)
   */
  y: number;
  orientation: "horizontal" | "vertical";
  used: boolean;
};
