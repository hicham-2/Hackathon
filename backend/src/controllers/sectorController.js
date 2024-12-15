import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class SectorController {
  async createSector(req, res) {
    const { name } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      if (name) {
        const sectorFoundByName = await sequelizeService.sectorService.findSectorByName(name);

        if (!sectorFoundByName) {
          const newSector = await sequelizeService.sectorService.createSector({ name });
          res.status(201).json(newSector);
        } else {
          res.status(400).json({ message: "Secteur déjà existant." });
        }
      } else {
        res.status(400).json({ message: "Le nom du secteur est obligatoire." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création du secteur." });
    }
  }

  async getAllSectors(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const sectors = await sequelizeService.sectorService.findAllSectors();
      res.status(200).json(sectors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des secteurs." });
    }
  }

  async getSectorBy(req, res) {
    const { field, value } = req.query;
    const sequelizeService = await SequelizeService.get();

    try {
      if (!field || !value) {
        res.status(400).json({ message: "Le champ et la valeur sont requis." });
        return;
      }

      const sector = await sequelizeService.sectorService.findSectorBy(field, value);

      if (sector) {
        res.status(200).json(sector);
      } else {
        res.status(404).json({ message: "Secteur non trouvé." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération du secteur." });
    }
  }

  async updateSector(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      if (name) {
        const updated = await sequelizeService.sectorService.updateSectorName(id, name);

        if (updated[0] === 0) {
          res.status(404).json({ message: "Secteur non trouvé ou inchangé." });
        } else {
          res.status(200).json({ message: "Secteur mis à jour avec succès." });
        }
      } else {
        res.status(400).json({ message: "Le nouveau nom du secteur est obligatoire." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la mise à jour du secteur." });
    }
  }

  async deleteSector(req, res) {
    const { id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      const deleted = await sequelizeService.sectorService.deleteSectorById(id);

      if (deleted === 0) {
        res.status(404).json({ message: "Secteur non trouvé." });
      } else {
        res.status(200).json({ message: "Secteur supprimé avec succès." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression du secteur." });
    }
  }

  async getAllClasses(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const classes = await sequelizeService.classeService.findAll();
      res.status(200).json(classes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des classes." });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/create", this.createSector.bind(this));
    router.get("/", this.getAllSectors.bind(this));
    router.get("/", this.getSectorBy.bind(this)); 
    router.put("/:id", this.updateSector.bind(this));
    router.delete("/:id", this.deleteSector.bind(this));
    router.get("/classes", this.getAllClasses.bind(this));

    return router;
  }
}
