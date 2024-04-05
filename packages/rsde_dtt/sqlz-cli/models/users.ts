import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { DB } from ".";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare uuid: string;
  declare email: string;
  declare status: CreationOptional<string>;

  static associate(models: DB) {
    // define association here
  }
}

export default function UserFactory(sequelize: Sequelize) {
  return User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "DISABLED", "BLACKLISTED"),
        defaultValue: "ACTIVE",
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "users", // We need to choose the model name
      name: { singular: "user", plural: "users" },
      underscored: true,
    }
  );
}
