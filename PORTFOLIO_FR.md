# DocChat — Présentation du Projet

## Qu'est-ce que c'est ?

DocChat est une application web qui vous permet de téléverser des documents (PDF, feuilles de calcul, fichiers texte) et d'interagir avec eux grâce à l'intelligence artificielle. Au lieu de parcourir manuellement un long document, vous posez simplement vos questions en langage naturel et obtenez des réponses instantanément.

## À qui s'adresse-t-il ?

À toute personne travaillant régulièrement avec des documents : chercheurs, juristes, analystes, étudiants, ou toute personne souhaitant extraire rapidement des informations pertinentes sans avoir à lire chaque page.

## Quel problème résout-il ?

La lecture et la recherche d'informations dans de longs documents sont souvent chronophages. DocChat connecte directement vos fichiers à un modèle d'intelligence artificielle avancé, vous permettant de poser des questions telles que « Quels sont les principaux résultats ? » ou « Que dit le contrat concernant la résiliation ? » et d'obtenir une réponse claire en quelques secondes.

## Fonctionnalités principales

* **Téléversement de documents variés** — prise en charge des fichiers PDF, CSV et TXT
* **Conversation avec vos documents** — questions-réponses en langage naturel alimentées par l'IA
* **Choix du fournisseur d'IA** — sélectionnez facilement Claude (Anthropic), GPT (OpenAI), Mistral ou un modèle local Ollama depuis une liste déroulante, sans connaissances techniques particulières
* **Sécurisé** — les fichiers sont stockés dans votre espace de stockage privé ; l'accès nécessite une authentification
* **Installation en une seule commande** — l'ensemble de l'application (frontend, backend, base de données et stockage de fichiers) démarre avec une simple commande : `docker-compose up`

## Comment cela fonctionne-t-il ? (version simplifiée)

1. Vous téléversez un document
2. L'application extrait son contenu textuel et le découpe en segments exploitables
3. Lorsque vous posez une question, les passages les plus pertinents sont transmis au modèle d'IA sélectionné
4. L'IA analyse ces informations et génère une réponse adaptée

## Choix technologiques (en termes simples)

| Composant             | Technologie                     | Pourquoi ?                                                          |
| --------------------- | ------------------------------- | ------------------------------------------------------------------- |
| Interface web         | React                           | Application moderne, rapide et réactive                             |
| Serveur               | Node.js + Express               | Gère les téléversements de fichiers et les communications avec l'IA |
| Stockage des fichiers | MinIO (local) / AWS S3 (cloud)  | Stocke les fichiers PDF, CSV et TXT                                 |
| Base de données       | DynamoDB                        | Conserve les comptes utilisateurs et les métadonnées des documents  |
| Fournisseurs d'IA     | Claude, OpenAI, Mistral, Ollama | Interchangeables via un simple sélecteur dans l'interface           |
| Infrastructure        | Docker Compose                  | Permet de lancer l'ensemble du système avec une seule commande      |

## État actuel du projet

Phase 0 terminée — l'infrastructure de base a été mise en place. L'application démarre correctement, mais les fonctionnalités métier ne sont pas encore implémentées. Les prochaines phases couvriront l'authentification, le téléversement de fichiers et le système de conversation.

## Feuille de route

| Phase | Fonctionnalité développée                                   |
| ----- | ----------------------------------------------------------- |
| 1     | Connexion et inscription des utilisateurs                   |
| 2     | Téléversement des fichiers et extraction du texte           |
| 3     | Découpage du texte pour optimiser le contexte envoyé à l'IA |
| 4     | Intégration du système de conversation avec l'IA            |
| 5     | Interface de sélection du fournisseur d'IA                  |
| 6     | Interface de chat complète                                  |
| 7     | Configuration Docker prête pour la production               |

