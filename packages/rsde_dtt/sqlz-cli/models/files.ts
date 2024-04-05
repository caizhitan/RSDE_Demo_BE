import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
} from "sequelize";
import { DB } from ".";

export class File extends Model<
    InferAttributes<File>,
    InferCreationAttributes<File>
>{
    declare fileID: string;
    declare fileName: string;
    declare fileType: CreationOptional<string>;
    declare fileURL: string;
}

export default function FileFactory(sequelize: Sequelize){
    return File.init(
        {
            fileID: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fileType: {
                type: DataTypes.ENUM("PDF", "Excel"),
                defaultValue: "PDF",
                allowNull: false,
            },
            fileURL: {
                type:DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: "files", // We need to choose the model name
            name: { singular: "file", plural: "files" },
            underscored: false,
          }
    );
}