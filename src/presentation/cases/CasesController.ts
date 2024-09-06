import { Request, Response } from "express";
import { CasesModel } from "../../data/models/cases.model";


export class CasesController {

  getCases = async (req: Request, res: Response) => {
    const cases = await CasesModel.find();
    res.send(cases);
  }

  getCaseById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const foundCase = await CasesModel.findById(id);
    if (!foundCase) return res.status(404).send(`No case found with the given id: ` + id);

    return foundCase;
  } 

  saveCase = async (req: Request, res: Response) => {
    console.log('body', req.body);
    const { genre, age, lat, lng } = req.body;
    const newCase = await CasesModel.create({
      age: age,
      genre: genre,
      lat: lat,
      lng: lng,
    });
  
    return res.status(201).send(newCase);
  }

}