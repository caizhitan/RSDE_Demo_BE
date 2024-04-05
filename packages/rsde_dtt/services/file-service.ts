import { createFileSchema, deleteFileSchema, getFileSchema, updateFileSchema } from "../zod-schemas/file-schema";
import { DB } from "../sqlz-cli/models";
import { AppError, commonErrors } from "@wotm/utils";
import { v4 as uuidv4} from 'uuid';
import { Op, Sequelize, json } from "sequelize";

export class FileService {
    public constructor(private db: DB) {}

    public async getAllFile() {
        const files = await this.db.files.findAll()

        return files;
    }
    
    public async getPaginatedFile(page: number, perPage: number) {

        const { rows, count } = await this.db.files.findAndCountAll(
            {limit: perPage,
             offset: perPage * (page - 1),
            }
        )

        if(!rows)
            throw new AppError(commonErrors.NotFound, "No files found", true);

       const result = rows;
        
        return result;
    }

    public async getFilteredFile(type: string) {
        const file = await this.db.files.findAll({
            where: {
                fileType: type
            },
        });
        if (!file)
            throw new AppError(commonErrors.NotFound, "Files Not Found", true);
        return file;
    }

    public async getSearchedFile(name: string) {
        const file = await this.db.files.findAll({
            where: {
                fileName: {
                    [Op.like]: '%' + name + '%'
                }
            },
        });
        if (!file)
            throw new AppError(commonErrors.NotFound, "Files Not Found", true);
        return file;
    }

    public async postFile(options: Zod.infer<typeof createFileSchema>) {
        const file = await this.db.files.create({
            fileID: uuidv4(),
            fileName: options.fileName,
            fileType: options.fileType,
            fileURL: options.fileURL
        });
        if (!file)
            throw new AppError(commonErrors.InvalidArgument, "Invalid file input", true)

        return file;
    }

    public async deleteFile(options: Zod.infer<typeof deleteFileSchema>) {
        const file = await this.db.files.findOne({
            where: {
                fileID: options.fileID
            }
        });
        if (!file)
            throw new AppError(commonErrors.NotFound, "File Not Found", true);

        await file.destroy();
    }

    public async updateFile(options: Zod.infer<typeof updateFileSchema>) {
        const file = await this.db.files.findOne({
            where: {
                fileID: options.fileID,
            },
        });
        if (!file)
            throw new AppError(commonErrors.NotFound, "File Not Found", true);

        file.set({
            fileID: options.fileID,
            fileURL: options.fileURL,
            fileName: options.fileName,
            fileType: options.fileType
        })

        await file.save();
    }
}