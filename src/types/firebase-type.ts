import { UUID } from "crypto";

export type DatabaseType = {
  stores: {
    [key: UUID]: {
      desks: {
        [key: UUID]: DeskType;
      };
    };
  };
  users: {
    [key: UUID]: UserType;
  };
};

export type UserType = {
  storeId: UUID;
};

export type DeskType = {
  x: number;
  y: number;
  rotation: 0 | 90;
  used: boolean;
};
