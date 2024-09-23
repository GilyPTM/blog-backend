import express, { Request, Response } from "express";
import * as contactModel from "../models/contact";
import { Contact } from "../types/Contact";
import * as bodyParser from "body-parser";

const contactRouter = express.Router();
var jsonParser = bodyParser.json();

contactRouter.get("/", async (req: Request, res: Response) => {
  contactModel.findAll((err: Error, messages: Contact[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    res.status(200).json({ data: messages });
  });
});

contactRouter.get("/:id", async (req: Request, res: Response) => {
  const contactId: number = Number(req.params.id);
  contactModel.findOne(contactId, (err: Error, message: Contact) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    res.status(200).json({ data: message });
  });
});

contactRouter.post(
  "/",
  jsonParser,

  async (req: Request, res: Response) => {
    console.log(req.body);

    const newContact: Contact = req.body;
    contactModel.create(newContact, (err: Error, userId: number) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res
        .status(200)
        .json({ message: "Mesajul a fost adaugat cu succes!" });
    });
  }
);

export { contactRouter };
