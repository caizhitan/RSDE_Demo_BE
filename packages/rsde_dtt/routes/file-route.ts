import { Controller, Delete, Get, Post } from "@wotm/decorater";
import { DB } from "../sqlz-cli/models";
import { Request, Response } from "express";
import { FileController } from "../controllers/file-controller";
import { FileService } from "../services/file-service";

@Controller("/files")
export default class FileRoute {
    db: DB;
    fileController: FileController;
    constructor(db: DB) {
        this.db = db;
        this.fileController = new FileController(new FileService(this.db));
    }

    @Get("")
    public getAllFile(req: Request, res: Response) {
        return this.fileController.getAllFile(req, res);
    }

    @Get("")
    public getPaginatedFile(req: Request, res: Response) {
        return this.fileController.getPaginatedFile(req, res);
    }

    @Get("/filtered")
    public getFilteredFile(req: Request, res: Response) {
        return this.fileController.getFilteredFile(req, res);
    }

    @Get("/search")
    public getSearchedFile(req: Request, res: Response){
        return this.fileController.getSearchedFile(req, res);
    }

    @Get("/s3Url")
    public getUrl(req: Request, res: Response){
        return this.fileController.getUrl(req, res);
    }

    @Get("/signedUrl")
    public openFile(req: Request, res: Response){
        return this.fileController.openFile(req, res);
    }

    @Post("/upload")
    public postFile(req: Request, res: Response) {
        return this.fileController.postFile(req, res);
    }

    @Post("/delete")
    public deleteFile(req: Request, res: Response) {
        return this.fileController.deleteFile(req, res);
    }

    @Post("/edit")
    public editFile(req: Request, res: Response) {
        return this.fileController.editFile(req, res);
    }

    @Post("/deleteS3File")
    public deleteS3File(req: Request, res: Response) {
        return this.fileController.deleteS3File(req, res);
    }
}