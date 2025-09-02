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
  x: number;
  y: number;
  rotation: 0 | 90;
  used: boolean;
};
