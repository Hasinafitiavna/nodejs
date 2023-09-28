import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import {Utilisateur} from "../entity/Utilisateur";

const router = express.Router();

router.get("/getAllUtilisateur", async (req: Request, res: Response) => {
    const userRepository = getRepository(Utilisateur);
    const users = await userRepository.find();
    console.log(users.length)
    return res.json(users);
});
router.post("/login", async (req: Request, res: Response) => {

    const userRepository = getRepository(Utilisateur);
    const { email, password } = req.body;
    const users = await userRepository.find({where: {email,password}});
    if (users.length !== 0){
        return res.json({value: true});
    }else{
        return res.json({value: false});
    }
});
interface UtilisateurData {
    nom: string;
    prenom: string;
    email: string;
    password: string;
}
router.post("/createUtilisateur", async (req: Request<any, any, UtilisateurData>, res: Response) => {
    try {
        // Récupérer les données de la requête POST
        const { nom, prenom, email, password } = req.body;

        // Créer une nouvelle instance de l'entité Utilisateur
        const nouvelUtilisateur = new Utilisateur();
        nouvelUtilisateur.nom = nom;
        nouvelUtilisateur.prenom = prenom;
        nouvelUtilisateur.email = email;
        nouvelUtilisateur.password = password;

        // Enregistrer le nouvel utilisateur dans la base de données
        const userRepository = getRepository(Utilisateur);
        await userRepository.save(nouvelUtilisateur);

        // Répondre avec le nouvel utilisateur créé
        return res.status(201).json(nouvelUtilisateur);
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        return res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
});
// router.get('/api/utilisateurs', async (req, res) => {
//     try {
//         const utilisateurRepository = getRepository(Utilisateur);
//         const utilisateurs = await utilisateurRepository.find(); // Utilisez `find()` pour récupérer tous les utilisateurs
//
//         return res.json(utilisateurs); // Renvoie la liste des utilisateurs sous forme JSON
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
//     }
// });
export default router;
