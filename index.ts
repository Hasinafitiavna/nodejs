import { createConnection, ConnectionOptions } from 'typeorm';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import userRoutes from './src/controller/UtilisateurController';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import { messageRoutes } from './src/controller/MessageTestController'; // Importez la fonction messageRoutes
import testRoutes from './src/controller/Test'
const app = express();
import dotenv from 'dotenv';
import { MessageTest } from './src/entity/MessageTest';
import { Utilisateur } from './src/entity/Utilisateur';
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez le middleware CORS pour permettre les requêtes depuis votre client React
const allowedOrigins = ['https://message-front.vercel.app', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

const port = process.env.PORT||5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('sendMessage', (message) => {
        // Enregistrez le message dans la base de données si nécessaire
        // Puis émettez le message à tous les clients connectés
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
// Utilisation du routeur pour les routes utilisateur
app.use('/utilisateur', userRoutes);
app.use('/test', testRoutes);

// Utilisation du routeur pour les routes de message
const messageRouter = messageRoutes(io);
app.use('/message', messageRouter);

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳');
});

// Connexion à la base de données
// createConnection()
//     .then(() => {
//         server.listen(port, () => {
//             console.log(`Serveur en cours d'exécution sur le port ${port}`);
//         });
//     })
//     .catch((error) => {
//         console.error('Erreur de connexion à la base de données : ', error);
//     });
// const dbOptions: ConnectionOptions = {
//     type: 'postgres',
//     url: process.env.DATABASE_URL, // Utilisez la variable d'environnement DATABASE_URL
//     synchronize: true,
//     logging: true,
//     entities: ['src/entity/*.ts'],
//     ssl: {
//         "rejectUnauthorized": false
//     },
//   };
  
//   // Connexion à la base de données
//   createConnection(dbOptions)
//     .then(() => {
//       server.listen(port, () => {
//         console.log(`Serveur en cours d'exécution sur le port ${port}`);
//       });
//     })
//     .catch((error) => {
//       console.error('Erreur de connexion à la base de données : ', error);
//     });

   createConnection({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port :5432,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            ssl: {
                "rejectUnauthorized": false
            }, 
            entities: [MessageTest,Utilisateur],
            synchronize: true, // À utiliser en développement uniquement
          
        }).then(()=>{
            server.listen(port, () => {
                console.log(`Serveur en cours d'exécution sur le port ${port}`);
            });
        })
    .catch((error) =>{
        console.error('unable to connect to postgres')
    })
// module.exports = app;
// module.exports = server;
