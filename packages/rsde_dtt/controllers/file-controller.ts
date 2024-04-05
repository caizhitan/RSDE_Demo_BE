import { BaseController } from "@wotm/middleware";
import { FileService } from "../services/file-service";
import { Request, Response } from "express";
import { zodValidator } from "@wotm/utils";
import { createFileSchema, deleteFileSchema, updateFileSchema } from "../zod-schemas/file-schema";
import { deleteS3File, generateUploadURL, getSignedFileURL } from '../services/upload-service';

export class FileController extends BaseController {
    public constructor(private fileService: FileService) {
        super();
    }

    public async getAllFile(req: Request, res: Response) {
        try{
            const result = await this.fileService.getAllFile();
            return this.returnSuccessResponse(res, result);
        }
        catch (error) {
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async getPaginatedFile(req: Request, res: Response) {
        const page = await req.query.Page as string;
        const perPage = await req.query.perPage as string;

        const pageInt = parseInt(page);
        const perPageInt = parseInt(perPage);

        try{
            const result = await this.fileService.getPaginatedFile(pageInt, perPageInt);
            return this.returnSuccessResponse(res, result);
        } catch (error) {
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async getFilteredFile(req: Request, res: Response) {
        try{
            //console.log(req)
            const fileType = await req.query.fileType as string
            const result = await this.fileService.getFilteredFile(fileType);
            return this.returnSuccessResponse(res, result);
        } catch (error) {
            //console.log(req)
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async getSearchedFile(req: Request, res: Response) {
        try{
            //console.log(req)
            const fileName = await req.query.fileName as string
            const result = await this.fileService.getSearchedFile(fileName);
            return this.returnSuccessResponse(res, result);
        } catch (error) {
            //console.log(req)
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async postFile(req: Request, res: Response) {
        try{
            const fileURL = await req.query.fileUrl;
            const fileType = await req.query.fileType;
            const fileName = await req.query.fileName;
            
            //S3 code here
                const options = zodValidator (
                    {
                        fileName : fileName,
                        fileType : fileType,
                        fileURL : fileURL,
                    },
                    createFileSchema
                )
                const result = await this.fileService.postFile(options);
                return this.returnSuccessResponse(res, result);
            
        } catch (error) {
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async deleteFile(req: Request, res: Response) {
        try{
            const fileID = await req.query.fileID
            const options = zodValidator(
                {
                    fileID: fileID,
                },
                deleteFileSchema
            );
            const result = await this.fileService.deleteFile(options);
            return this.returnSuccessResponse(res, result);
        } catch (error) {
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async editFile(req: Request, res: Response) {
        try{
            const fileID = await req.query.fileID;
            const fileURL = await req.query.fileURL;
            const fileType = await req.query.fileType;
            const fileName = await req.query.fileName;

            const options = zodValidator(
                {
                    fileID: fileID,
                    fileURL: fileURL,
                    fileType: fileType,
                    fileName: fileName,
                },
                updateFileSchema
            );

            const result = await this.fileService.updateFile(options);
            return this.returnSuccessResponse(res, result);
        } catch (error) {
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async getUrl(req: Request, res: Response){
        try{
            const fileName = await req.query.fileName;
            console.log('fileName')
            console.log(fileName)
            if (!fileName) {
                res.status(404).json({ error: 'Dataset not found' });
                return;
              }
              if ( typeof fileName !== "string" ) {
                res.status(500).json({ error: 'Invalid dataset' });
                return;
              }
            try{
                const url = await generateUploadURL(fileName)
                res.send({url})
            }
            catch(error){
                return this.returnErrorResponseV2(res, error);
            }
        }
        catch(error){
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async openFile(req: Request, res: Response) {
        try{
            const fileName = await req.query.fileName;
            if (!fileName) {
                res.status(404).json({ error: 'File not found' });
                return;
              }
            if ( typeof fileName !== "string" ) {
                res.status(500).json({ error: 'Invalid File' });
                return;
              }
            try{
                const url = await getSignedFileURL(fileName)
                res.send({url})
            }
            catch(error){
                return this.returnErrorResponseV2(res, error);
            }
        }
        catch(error){
            return this.returnErrorResponseV2(res, error);
        }
    }

    public async deleteS3File(req: Request, res: Response) {
        try{
            const fileName = await req.query.fileName;
            if (!fileName) {
                res.status(404).json({ error: 'File not found' });
                return;
            }
            if ( typeof fileName !== "string" ) {
                res.status(500).json({ error: 'Invalid File' });
                return;
            }
            try{
                res.send(deleteS3File(fileName));
            }
            catch(error){
                return this.returnErrorResponseV2(res, error);
            }
        } catch(error){
            return this.returnErrorResponseV2(res, error);
        }
    }
}