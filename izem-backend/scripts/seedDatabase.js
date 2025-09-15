const mongoose = require('mongoose');
const Recipe = require('../models/recipes');

// URL de connexion à MongoDB
const mongoURI = 'mongodb+srv://alycia:Mama270682.@cluster0.18x60.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0';

const recipes = [
    // recettes algerienne 
    {
      id:1,
      title: 'Couscous Algérien',
      image: "assets/images/Couscous_algerien.jpg",
      preptime: 120,
      ingredients: [
        { name: 'Semoule', quantity: 500 },
        { name: 'Agneau', quantity: 600 },
        { name: 'Pois chiches', quantity: 200 },
        { name: 'Carottes', quantity: 300 },
        { name: 'Courgettes', quantity: 300 },
        { name: 'Navets', quantity: 200 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Tomates', quantity: 300 },
        { name: 'Concentré de tomate', quantity: 50 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 },
        { name: 'Cumin', quantity: 5 },
        { name: 'Paprika', quantity: 5 }
      ],
      preparationSteps: [
        "Laver et couper les légumes en morceaux.",
        "Dans une grande marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter la viande d'agneau et la faire dorer de tous côtés.",
        "Ajouter les tomates, le concentré de tomate, et les épices.",
        "Verser de l'eau et laisser mijoter la viande pendant environ 1 heure.",
        "Ajouter les légumes et les pois chiches et continuer la cuisson.",
        "Préparer la semoule en la faisant cuire à la vapeur dans un couscoussier.",
        "Servir la semoule avec le ragoût de viande et de légumes."
      ],
      origins: ['Algérie'],
      recipetype:['plat'],
      servings: 6,
      description: 'Le couscous algérien traditionnel est préparé avec de la semoule de blé dur, des légumes de saison et de la viande d\'agneau. La semoule est cuite à la vapeur dans un couscoussier, tandis que les légumes mijotent dans un bouillon épicé avec la viande pour créer un plat savoureux et nourrissant.'
    },
    {
      id:2,
      title: 'Berkoukes',
      image: "assets/images/berkoukes.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Berkoukes (pâtes en forme de gros grain)', quantity: 400 },
        { name: 'Poulet', quantity: 500 },
        { name: 'Pois chiches', quantity: 200 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Tomates', quantity: 300 },
        { name: 'Carottes', quantity: 200 },
        { name: 'Céleri', quantity: 100 },
        { name: 'Concentré de tomate', quantity: 50 },
        { name: 'Huile d\'olive', quantity: 30 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 },
        { name: 'Paprika', quantity: 5 },
        { name: 'Cumin', quantity: 5 }
      ],
      preparationSteps: [
        "Faire tremper les pois chiches toute une nuit.",
        "Dans une marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter le poulet et le faire dorer.",
        "Incorporer les tomates, le concentré de tomate et les épices.",
        "Ajouter les pois chiches trempés et couvrir d'eau.",
        "Laisser mijoter pendant 30 minutes.",
        "Ajouter les carottes et le céleri coupés en morceaux.",
        "Incorporer les pâtes Berkoukes et laisser cuire 20 minutes.",
        "Rectifier l'assaisonnement et servir chaud."
      ],      
      origins: ['Algérie'],
      recipetype:['plat'],
      servings: 4,
      description: 'Le Berkoukes est un plat traditionnel algérien à base de grosses pâtes en forme de grains et d\'un ragoût de légumes et de viande. Les pâtes sont cuites dans le bouillon pour absorber toutes les saveurs des épices et des légumes.'
    },
    {
      id:3,
      title: 'Lham Lahlou',
      image: "assets/images/lham_lahlou.jpg",
      preptime: 60,
      ingredients: [
        { name: 'Viande d\'agneau', quantity: 500 },
        { name: 'Pruneaux secs', quantity: 200 },
        { name: 'Abricots secs', quantity: 200 },
        { name: 'Raisins secs', quantity: 100 },
        { name: 'Sucre', quantity: 100 },
        { name: 'Cannelle', quantity: 10 },
        { name: 'Eau de fleur d\'oranger', quantity: 20 },
        { name: 'Beurre', quantity: 30 },
        { name: 'Sel', quantity: 5 }
      ],
      preparationSteps: [
        "Faire tremper les pois chiches toute une nuit.",
        "Dans une marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter le poulet et le faire dorer.",
        "Incorporer les tomates, le concentré de tomate et les épices.",
        "Ajouter les pois chiches trempés et couvrir d'eau.",
        "Laisser mijoter pendant 30 minutes.",
        "Ajouter les carottes et le céleri coupés en morceaux.",
        "Incorporer les pâtes Berkoukes et laisser cuire 20 minutes.",
        "Rectifier l'assaisonnement et servir chaud."
      ],
      
      origins: ['Algérie'],
      recipetype:['plat'],
      servings: 4,
      description: 'L\'ham Lahlou est un plat sucré-salé traditionnel algérien, composé de viande d\'agneau cuite avec des fruits secs et des épices douces. Ce mélange de sucré et de salé est particulièrement apprécié pendant le Ramadan.'
    },
    {
      id:4,
      title: 'Mtewem',
      image: "assets/images/mtewem.jpg",
      preptime: 70,
      ingredients: [
        { name: 'Poulet', quantity: 800 },
        { name: 'Ail', quantity: 50 },
        { name: 'Oignon', quantity: 200 },
        { name: 'Citron confit', quantity: 100 },
        { name: 'Olives vertes', quantity: 100 },
        { name: 'Huile d\'olive', quantity: 30 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 },
        { name: 'Cumin', quantity: 5 },
        { name: 'Coriandre fraîche', quantity: 20 }
      ],
      preparationSteps: [
        "Faire tremper les pois chiches toute une nuit.",
        "Dans une marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter le poulet et le faire dorer.",
        "Incorporer les tomates, le concentré de tomate et les épices.",
        "Ajouter les pois chiches trempés et couvrir d'eau.",
        "Laisser mijoter pendant 30 minutes.",
        "Ajouter les carottes et le céleri coupés en morceaux.",
        "Incorporer les pâtes Berkoukes et laisser cuire 20 minutes.",
        "Rectifier l'assaisonnement et servir chaud."
      ],      
      origins: ['Algérie'],
      recipetype:['plat'],
      servings: 4,
      description: 'Le Mtewem est un plat algérien à base de poulet mijoté dans une sauce à l\'ail. Le poulet est d\'abord doré puis cuit lentement avec des épices, de l\'ail écrasé et des olives pour créer un plat savoureux et parfumé.'
    },
    {
      id:5,
      title: 'Tajine Zitoun',
      image: "assets/images/tajine_zitoun.jpg",
      preptime: 80,
      ingredients: [
        { name: 'Viande d\'agneau', quantity: 600 },
        { name: 'Olives vertes', quantity: 200 },
        { name: 'Citron confit', quantity: 100 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Concentré de tomate', quantity: 30 },
        { name: 'Ail', quantity: 20 },
        { name: 'Huile d\'olive', quantity: 40 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 },
        { name: 'Cumin', quantity: 5 },
        { name: 'Coriandre fraîche', quantity: 20 }
      ],
      preparationSteps: [
        "Faire tremper les pois chiches toute une nuit.",
        "Dans une marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter le poulet et le faire dorer.",
        "Incorporer les tomates, le concentré de tomate et les épices.",
        "Ajouter les pois chiches trempés et couvrir d'eau.",
        "Laisser mijoter pendant 30 minutes.",
        "Ajouter les carottes et le céleri coupés en morceaux.",
        "Incorporer les pâtes Berkoukes et laisser cuire 20 minutes.",
        "Rectifier l'assaisonnement et servir chaud."
      ],      
      origins: ['Algérie'],
      recipetype:['plat'],
      servings: 4,
      description: 'Le Tajine Zitoun est un plat algérien composé de viande mijotée avec des olives et du citron confit. La cuisson lente permet aux saveurs de se mélanger parfaitement, créant un plat riche et savoureux.'
    },
    {
      id:6,
      title: 'Rechta',
      image: "assets/images/rechta.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Pâtes Rechta', quantity: 500 },
        { name: 'Poulet', quantity: 600 },
        { name: 'Pois chiches', quantity: 200 },
        { name: 'Navet', quantity: 200 },
        { name: 'Courgette', quantity: 200 },
        { name: 'Carotte', quantity: 200 },
        { name: 'Oignon', quantity: 200 },
        { name: 'Cannelle', quantity: 5 },
        { name: 'Huile d\'olive', quantity: 30 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Faire tremper les pois chiches toute une nuit.",
        "Dans une marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter le poulet et le faire dorer.",
        "Incorporer les tomates, le concentré de tomate et les épices.",
        "Ajouter les pois chiches trempés et couvrir d'eau.",
        "Laisser mijoter pendant 30 minutes.",
        "Ajouter les carottes et le céleri coupés en morceaux.",
        "Incorporer les pâtes Berkoukes et laisser cuire 20 minutes.",
        "Rectifier l'assaisonnement et servir chaud."
      ],      
      origins: ['Algérie'],
      recipetype:['plat'],
      servings: 6,
      description: 'La Rechta est un plat festif algérien composé de fines pâtes artisanales servies avec une sauce blanche au poulet et aux légumes. Ce plat est traditionnellement préparé pour les célébrations et événements spéciaux.'
    },
    // Algerian Desserts
    {
      id:7,
      title: 'Kalb El Louz',
      image: "assets/images/kalb_ellouz.jpg",
      preptime: 60,
      ingredients: [
        { name: 'Semoule fine', quantity: 500 },
        { name: 'Amandes en poudre', quantity: 300 },
        { name: 'Sucre', quantity: 300 },
        { name: 'Beurre', quantity: 200 },
        { name: 'Eau de fleur d\'oranger', quantity: 50 },
        { name: 'Eau', quantity: 500 },
        { name: 'Amandes effilées', quantity: 100 }
      ],
      preparationSteps: [
        "Faire tremper les pois chiches toute une nuit.",
        "Dans une marmite, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter le poulet et le faire dorer.",
        "Incorporer les tomates, le concentré de tomate et les épices.",
        "Ajouter les pois chiches trempés et couvrir d'eau.",
        "Laisser mijoter pendant 30 minutes.",
        "Ajouter les carottes et le céleri coupés en morceaux.",
        "Incorporer les pâtes Berkoukes et laisser cuire 20 minutes.",
        "Rectifier l'assaisonnement et servir chaud."
      ],
      
      origins: ['Algérie'],
      recipetype:['dessert'],
      servings: 8,
      description: 'Kalb El Louz (cœur d\'amande) est un dessert algérien à base de semoule et d\'amandes, imbibé d\'un sirop parfumé à l\'eau de fleur d\'oranger. Ce gâteau moelleux et fondant est souvent servi pendant le Ramadan.'
    },
    {
      id:8,
      title: 'Mhalbi',
      image: "assets/images/Mhalbi.jpg",
      preptime: 40,
      ingredients: [
        { name: 'Lait', quantity: 1000 },
        { name: 'Maïzena', quantity: 80 },
        { name: 'Sucre', quantity: 150 },
        { name: 'Eau de fleur d\'oranger', quantity: 15 },
        { name: 'Cannelle en poudre', quantity: 5 },
        { name: 'Pistaches concassées', quantity: 50 }
      ],
      preparationSteps: [
        "Faire cuire le poulet dans une casserole avec des oignons, du persil, de la coriandre, et les épices (cannelle, gingembre, safran).",
        "Une fois cuit, effilocher le poulet et réduire le jus de cuisson.",
        "Battre les œufs et les faire scrambler dans la poêle avec le poulet effiloché.",
        "Faire torréfier les amandes effilées et les concasser grossièrement.",
        "Préchauffer le four à 180°C.",
        "Beurrer généreusement plusieurs feuilles de brick.",
        "Superposer les feuilles de brick en les disposant en étoile.",
        "Garnir au centre avec le mélange poulet-œufs et amandes.",
        "Refermer les feuilles de brick pour former un paquet bien fermé.",
        "Badigeonner de beurre fondu et enfourner jusqu'à ce que la pastilla soit dorée.",
        "À la sortie du four, saupoudrer généreusement de sucre glace et de cannelle."
      ],
      origins: ['Algérie'],
      recipetype:['dessert'],
      servings: 6,
      description: 'Le Mhalbi est un dessert crémeux algérien à base de lait et de maïzena, parfumé à l\'eau de fleur d\'oranger et saupoudré de cannelle. Sa texture douce et son goût léger en font un dessert rafraîchissant parfait après un repas.'
    },
    {
      id:9,
      title: 'Makrout aux Amandes',
      image: "assets/images/makrout.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Semoule fine', quantity: 500 },
        { name: 'Beurre', quantity: 200 },
        { name: 'Amandes en poudre', quantity: 300 },
        { name: 'Sucre', quantity: 200 },
        { name: 'Eau de fleur d\'oranger', quantity: 30 },
        { name: 'Miel', quantity: 300 },
        { name: 'Huile pour friture', quantity: 500 }
      ],
      preparationSteps: [
        "Préparer la pâte en mélangeant semoule, beurre fondu et eau de fleur d'oranger.",
        "Préparer la farce en mélangeant amandes en poudre, sucre et eau de fleur d'oranger.",
        "Étaler la pâte sur 1 cm d'épaisseur et découper des rectangles.",
        "Déposer un peu de farce au centre de chaque rectangle.",
        "Refermer en formant des losanges et bien souder les bords.",
        "Frire dans l'huile chaude jusqu'à coloration dorée.",
        "Égoutter sur du papier absorbant.",
        "Tremper les makrout dans le miel tiède avant de servir."
      ],
      origins:['Algérie'] ,
      recipetype:['dessert'],
      servings: 30,
      description: 'Le Makrout aux amandes est un gâteau traditionnel algérien à base de semoule et farci d\'une pâte d\'amandes sucrée. Ces petits losanges sont frits puis trempés dans du miel parfumé, créant un délicieux contraste de textures.'
    },
    {
      id:10,
      title: 'Baklawa Algérienne',
      image: "assets/images/baklawa_alg.jpg",
      preptime: 120,
      ingredients: [
        { name: 'Pâte filo', quantity: 500 },
        { name: 'Amandes moulues', quantity: 400 },
        { name: 'Sucre', quantity: 200 },
        { name: 'Beurre fondu', quantity: 250 },
        { name: 'Eau de fleur d\'oranger', quantity: 30 },
        { name: 'Miel', quantity: 300 },
        { name: 'Pistaches concassées', quantity: 100 }
      ],
      preparationSteps: [
        "Préchauffer le four à 180°C.",
        "Mélanger les amandes moulues avec le sucre et l'eau de fleur d'oranger.",
        "Beurrer un moule et disposer une feuille de pâte filo.",
        "Badigeonner de beurre fondu et répéter l'opération sur 5 feuilles.",
        "Étaler la moitié de la farce aux amandes.",
        "Ajouter 5 nouvelles feuilles en beurrant chaque couche.",
        "Étaler le reste de farce et finir avec 5 dernières feuilles.",
        "Couper en losanges avec un couteau bien aiguisé.",
        "Enfourner pour 30-35 minutes jusqu'à belle dorure.",
        "Verser le miel chaud sur la baklawa à la sortie du four.",
        "Parsemer de pistaches concassées avant de servir."
      ],
      
      origins: ['Algérie'],
      recipetype:['dessert'],
      servings: 24,
      description: 'La Baklawa algérienne est un dessert feuilleté à base de pâte filo et d\'amandes, imbibé de sirop parfumé. Ces petites pâtisseries en forme de losanges sont riches et sucrées, idéales pour accompagner un thé à la menthe.'
    },
    {
      id:11,
      title: 'Tamina',
      image: "assets/images/tamina.jpg",
      preptime: 30,
      ingredients: [
        { name: 'Semoule moyenne', quantity: 300 },
        { name: 'Beurre', quantity: 150 },
        { name: 'Miel', quantity: 200 },
        { name: 'Cannelle en poudre', quantity: 10 },
        { name: 'Amandes effilées', quantity: 50 }
      ],
      preparationSteps: [
        "Faire torréfier la semoule à sec dans une poêle à feu moyen jusqu'à coloration dorée.",
        "Ajouter le beurre et bien mélanger jusqu'à absorption complète.",
        "Incorporer le miel tout en remuant vigoureusement.",
        "Continuer à cuire 5 minutes jusqu'à obtenir une consistance homogène.",
        "Verser dans un plat de service et tasser avec une cuillère.",
        "Saupoudrer généreusement de cannelle.",
        "Parsemer d'amandes effilées grillées.",
        "Laisser refroidir avant de découper en carrés."
      ],
      origins: ['Algérie'],
      recipetype:['dessert'],
      servings: 6,
      description: 'La Tamina est un dessert algérien simple à base de semoule grillée mélangée avec du beurre et du miel. Parfumée à la cannelle et décorée d\'amandes, cette pâte sucrée est traditionnellement servie lors des célébrations familiales.'
    },
    {
      id:12,
      title: 'Dziriyette',
      image: "assets/images/dziriyette.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Amandes moulues', quantity: 400 },
        { name: 'Sucre glace', quantity: 200 },
        { name: 'Blanc d\'œuf', quantity: 100 },
        { name: 'Eau de fleur d\'oranger', quantity: 15 },
        { name: 'Pâte d\'amande', quantity: 200 },
        { name: 'Colorant alimentaire rouge', quantity: 2 }
      ],
      preparationSteps: [
        "Mélanger les amandes moulues avec le sucre glace et les blancs d'œufs.",
        "Ajouter l'eau de fleur d'oranger et bien malaxer.",
        "Diviser la pâte en deux, colorer une moitié en rose.",
        "Former des petites boules avec la pâte nature.",
        "Enrober chaque boule avec la pâte rose pour former des coques.",
        "Laisser sécher à température ambiante 2 heures.",
        "Saupoudrer de sucre glace avant de servir."
      ],
      origins: ['Algérie'],
      recipetype:['dessert'],
      servings: 20,
      description: 'Les Dziriyettes sont des petits gâteaux algériens à base d\'amandes, reconnaissables à leur belle couleur rose. Ces douceurs fondantes sont parfumées à l\'eau de fleur d\'oranger et enrobées de pâte d\'amande colorée.'
    },
  
    // plats marocains
    {
      id:13,
      title: 'Pastilla au Poulet',
      image: "assets/images/pastilla.jpg",
      preptime: 120,
      ingredients: [
        { name: 'Poulet', quantity: 800 },
        { name: 'Oignons', quantity: 300 },
        { name: 'Amandes effilées', quantity: 200 },
        { name: 'Œufs', quantity: 300 },
        { name: 'Feuilles de brick', quantity: 300 },
        { name: 'Cannelle', quantity: 10 },
        { name: 'Gingembre', quantity: 10 },
        { name: 'Safran', quantity: 2 },
        { name: 'Persil', quantity: 50 },
        { name: 'Coriandre', quantity: 50 },
        { name: 'Beurre', quantity: 100 },
        { name: 'Sucre glace', quantity: 50 },
        { name: 'Huile d\'olive', quantity: 50 }
      ],
      preparationSteps: [
        "Faire revenir les oignons dans l'huile d'olive jusqu'à translucidité.",
        "Ajouter le poulet coupé en morceaux et faire dorer.",
        "Incorporer les épices (cannelle, gingembre, safran), le persil et la coriandre.",
        "Couvrir d'eau et laisser mijoter 45 minutes jusqu'à ce que le poulet soit tendre.",
        "Retirer le poulet, effilocher la viande et réduire le jus de cuisson.",
        "Faire revenir les amandes effilées dans du beurre jusqu'à dorure.",
        "Battre les œufs et les cuire en omelette dans le jus de cuisson réduit.",
        "Beurrer un moule et disposer des feuilles de brick en les superposant et en les badigeonnant de beurre.",
        "Alterner couches de poulet, omelette et amandes.",
        "Refermer les feuilles de brick pour former un paquet bien fermé.",
        "Badigeonner de beurre fondu et enfourner à 180°C pendant 20-25 minutes jusqu'à dorure.",
        "Retourner la pastilla sur un plat de service et saupoudrer généreusement de sucre glace et de cannelle.",
        "Servir chaud en découpant des parts comme un gâteau."
      ],
      origins: ['Maroc'],
      recipetype:['plat'],
      servings: 8,
      description: 'La pastilla au poulet est un plat marocain festif, mêlant le sucré et le salé. Cette tourte feuilletée contient du poulet émincé, des œufs, des amandes et des épices, le tout saupoudré de sucre glace et de cannelle.'
    },
    {
      id:14,
      title: 'Tajine de Poulet',
      image: "assets/images/tajine_poulet.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Poulet', quantity: 800 },
        { name: 'Oignons', quantity: 300 },
        { name: 'Olives vertes', quantity: 100 },
        { name: 'Citron confit', quantity: 100 },
        { name: 'Gingembre', quantity: 10 },
        { name: 'Safran', quantity: 1 },
        { name: 'Curcuma', quantity: 5 },
        { name: 'Coriandre fraîche', quantity: 30 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Ail', quantity: 20 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Dans un tajine ou une cocotte, faire revenir les oignons émincés dans l'huile d'olive.",
        "Ajouter les morceaux de poulet et les faire dorer sur toutes les faces.",
        "Incorporer l'ail pressé, le gingembre, le safran, le curcuma, le sel et le poivre.",
        "Ajouter les tomates coupées en dés et le concentré de tomate.",
        "Couvrir d'eau à mi-hauteur du poulet et porter à ébullition.",
        "Baisser le feu et ajouter les olives et les citrons confits coupés en morceaux.",
        "Laisser mijoter à couvert pendant 45 minutes en retournant le poulet à mi-cuisson.",
        "Vérifier l'assaisonnement et ajouter de la coriandre fraîche ciselée en fin de cuisson.",
        "Servir directement dans le tajine avec du pain marocain."
      ],
      origins: ['Maroc'],
      recipetype:['plat'],
      servings: 4,
      description: 'Le tajine de poulet marocain est un plat mijoté lentement dans un plat en terre cuite traditionnel. Le poulet est tendre et parfumé par les épices, les olives et le citron confit, créant un mélange savoureux de saveurs.'
    },
    {
      id:15,
      title: 'Tajine Viande et Pommes de Terre',
      image: "assets/images/tajine_pommedeterre.jpg",
      preptime: 100,
      ingredients: [
        { name: 'Viande de bœuf', quantity: 700 },
        { name: 'Pommes de terre', quantity: 600 },
        { name: 'Oignons', quantity: 300 },
        { name: 'Tomates', quantity: 300 },
        { name: 'Ail', quantity: 20 },
        { name: 'Cumin', quantity: 10 },
        { name: 'Paprika', quantity: 10 },
        { name: 'Gingembre', quantity: 10 },
        { name: 'Persil', quantity: 30 },
        { name: 'Coriandre', quantity: 30 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Dans un tajine, faire revenir les oignons émincés dans l'huile d'olive.",
        "Ajouter la viande coupée en morceaux et bien la faire dorer.",
        "Incorporer les épices (cumin, paprika, gingembre), l'ail écrasé, le persil et la coriandre hachés.",
        "Ajouter les tomates coupées en dés et le concentré de tomate.",
        "Couvrir d'eau et laisser mijoter à feu doux pendant 1 heure.",
        "Peler et couper les pommes de terre en gros quartiers.",
        "Ajouter les pommes de terre dans le tajine et poursuivre la cuisson 30 minutes.",
        "Vérifier la cuisson de la viande et des pommes de terre.",
        "En fin de cuisson, rectifier l'assaisonnement et saupoudrer de persil frais.",
        "Servir bien chaud avec du pain pour tremper dans la sauce."
      ],
      origins: ['Maroc'],
      recipetype:['plat'],
      servings: 4,
      description: 'Ce tajine marocain combine la tendreté de la viande de bœuf avec des pommes de terre fondantes, le tout mijoté dans une sauce richement épicée. Ce plat réconfortant est parfait pour un repas familial.'
    },
    {
      id:16,
      title: 'Couscous Marocain',
      image: "assets/images/couscous_mar.jpg",
      preptime: 120,
      ingredients: [
        { name: 'Semoule de couscous', quantity: 500 },
        { name: 'Agneau', quantity: 700 },
        { name: 'Pois chiches', quantity: 200 },
        { name: 'Courgettes', quantity: 300 },
        { name: 'Carottes', quantity: 300 },
        { name: 'Navets', quantity: 200 },
        { name: 'Citrouille', quantity: 300 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Tomates', quantity: 300 },
        { name: 'Concentré de tomate', quantity: 50 },
        { name: 'Ras el hanout', quantity: 15 },
        { name: 'Cannelle', quantity: 5 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Dans une couscoussier, faire revenir les oignons dans l'huile d'olive.",
        "Ajouter la viande d'agneau et la faire dorer sur toutes ses faces.",
        "Incorporer les épices (ras el hanout, cannelle), le concentré de tomate et les tomates coupées.",
        "Couvrir d'eau chaude et porter à ébullition.",
        "Ajouter les pois chiches trempés depuis la veille.",
        "Laisser mijoter pendant 30 minutes.",
        "Préparer la semoule : humidifier avec de l'eau salée et séparer les grains à la main.",
        "Ajouter les légumes coupés en gros morceaux (courgettes, carottes, navets, citrouille) dans la couscoussier.",
        "Disposer la semoule dans le panier vapeur et cuire 20 minutes au-dessus du bouillon.",
        "Retirer la semoule, l'humidifier à nouveau et séparer les grains.",
        "Remettre à cuire 15 minutes supplémentaires.",
        "Dresser la semoule dans un grand plat, disposer la viande et les légumes autour.",
        "Arroser d'un peu de bouillon et servir le reste à part."
      ],
      origins: ['Maroc'],
      recipetype:['plat'],
      servings: 6,
      description: 'Le couscous marocain est célèbre pour sa semoule fine et légère accompagnée d\'un riche ragoût de viande et de légumes. Les légumes variés et les épices comme le ras el hanout donnent à ce plat sa saveur distinctive et authentique.'
    },
    // desserts marocains 
    {
      id:17,
      title: 'Kaab El Ghzal',
      image: "assets/images/kaab_elghzal.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Farine', quantity: 500 },
        { name: 'Beurre', quantity: 200 },
        { name: 'Amandes moulues', quantity: 400 },
        { name: 'Sucre glace', quantity: 200 },
        { name: 'Eau de fleur d\'oranger', quantity: 20 },
        { name: 'Cannelle', quantity: 5 },
        { name: 'Œuf', quantity: 50 }
      ],
      preparationSteps: [
        "Préparer la pâte en mélangeant farine, beurre et eau de fleur d'oranger.",
        "Préparer la farce en mélangeant amandes, sucre et cannelle.",
        "Étaler la pâte finement et découper des cercles.",
        "Déposer de la farce sur chaque cercle et former des croissants.",
        "Dorer à l'œuf battu et enfourner à 180°C pendant 20 minutes.",
        "Saupoudrer de sucre glace à la sortie du four."
      ],
      origins: ['Maroc'],
      recipetype:['dessert'],
      servings: 24,
      description: 'Kaab El Ghzal, aussi appelé "cornes de gazelle", est un célèbre gâteau marocain en forme de croissant fourré d\'une délicieuse pâte d\'amandes parfumée. La pâtisserie est légèrement dorée puis saupoudrée de sucre glace.'
    },
    {
      id:'18',
      title: 'Fekkas',
      image: "assets/images/fekkas.jpg",
      preptime: 120,
      ingredients: [
        { name: 'Farine', quantity: 500 },
        { name: 'Sucre', quantity: 200 },
        { name: 'Beurre', quantity: 150 },
        { name: 'Œufs', quantity: 150 },
        { name: 'Amandes', quantity: 300 },
        { name: 'Levure chimique', quantity: 10 },
        { name: 'Vanille', quantity: 5 },
        { name: 'Eau de fleur d\'oranger', quantity: 10 },
        { name: 'Graines d\'anis', quantity: 10 }
      ],
      preparationSteps: [
        "Mélanger la farine avec le sucre et la levure.",
        "Ajouter les œufs, le beurre fondu et les arômes.",
        "Incorporer les amandes et les graines d'anis.",
        "Former des boudins et cuire à 180°C pendant 25 minutes.",
        "Laisser refroidir puis couper en tranches.",
        "Remettre au four 10 minutes pour sécher les biscuits."
      ],
      origins: ['Maroc'],
      recipetype:['dessert'],
      servings: 40,
      description: 'Les Fekkas sont des biscuits marocains croquants similaires aux biscottis italiens. Préparés avec des amandes entières et parfois des raisins secs, ils sont cuits deux fois pour obtenir ce croquant caractéristique, parfait pour accompagner le thé.'
    },
    {
      id:19,
      title: 'Chebakia',
      image: "assets/images/chebakia.jpg",
      preptime: 150,
      ingredients: [
        { name: 'Farine', quantity: 500 },
        { name: 'Graines de sésame grillées', quantity: 200 },
        { name: 'Beurre', quantity: 150 },
        { name: 'Levure de boulanger', quantity: 10 },
        { name: 'Cannelle', quantity: 5 },
        { name: 'Anis', quantity: 5 },
        { name: 'Gomme arabique', quantity: 5 },
        { name: 'Miel', quantity: 500 },
        { name: 'Eau de fleur d\'oranger', quantity: 30 },
        { name: 'Huile pour friture', quantity: 500 }
      ],
      preparationSteps: [
        "Pétrir la farine avec les épices, le beurre et la levure.",
        "Ajouter progressivement l'eau pour former une pâte souple.",
        "Étaler finement et découper des bandes.",
        "Former des rosaces en entrelaçant les bandes.",
        "Frire dans l'huile chaude jusqu'à dorure.",
        "Tremper dans le miel chaud parfumé à l'eau de fleur d'oranger.",
        "Saupoudrer de sésame grillé avant de servir."
      ],
      origins: ['Maroc'],
      recipetype:['dessert'],
      servings: 30,
      description: 'La Chebakia est une pâtisserie marocaine traditionnelle, en forme de fleur, frite et trempée dans du miel parfumé à l\'eau de fleur d\'oranger. Ces gâteaux sont particulièrement populaires pendant le Ramadan.'
    },
    {
      id:20,
      title: 'Ghraiba à la Semoule et Noix de Coco',
      image: "assets/images/ghraybacoco.jpg",
      preptime: 60,
      ingredients: [
        { name: 'Semoule fine', quantity: 300 },
        { name: 'Noix de coco râpée', quantity: 150 },
        { name: 'Beurre', quantity: 150 },
        { name: 'Sucre glace', quantity: 150 },
        { name: 'Levure chimique', quantity: 5 },
        { name: 'Vanille', quantity: 5 },
        { name: 'Œuf', quantity: 50 },
        { name: 'Amandes entières', quantity: 30 }
      ],
      preparationSteps: [
        "Mélanger la semoule avec la noix de coco râpée.",
        "Ajouter le beurre ramolli et le sucre glace.",
        "Incorporer l'œuf et la vanille pour former une pâte.",
        "Former des boules et les aplatir légèrement.",
        "Décorer chaque biscuit avec une amande entière.",
        "Enfourner à 160°C pendant 20 minutes.",
        "Laisser refroidir avant de servir."
      ],
      origins: ['Maroc'],
      recipetype:['dessert'],
      servings: 20,
      description: 'Les Ghraibia sont des biscuits sablés marocains, légers et fondants en bouche. Cette variante à la semoule et noix de coco offre une texture particulièrement friable et un goût délicat, parfait pour accompagner un thé à la menthe.'
    },
  
    // recette tunisienne 
    {
      id:21,
      title: 'Couscous au Poisson',
      image: "assets/images/couscous_aupoisson.jpg",
      preptime: 90,
      ingredients: [
        { name: 'Semoule de couscous', quantity: 500 },
        { name: 'Poisson (mérou ou dorade)', quantity: 800 },
        { name: 'Pois chiches', quantity: 200 },
        { name: 'Carottes', quantity: 300 },
        { name: 'Courgettes', quantity: 300 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Tomates', quantity: 300 },
        { name: 'Harissa', quantity: 20 },
        { name: 'Ail', quantity: 30 },
        { name: 'Concentré de tomate', quantity: 50 },
        { name: 'Cumin', quantity: 10 },
        { name: 'Coriandre fraîche', quantity: 30 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Laver et couper les légumes (carottes, courgettes, oignons) en morceaux.",
        "Dans une grande marmite, faire revenir les oignons hachés dans l'huile d'olive.",
        "Ajouter les tomates, le concentré de tomate, et les épices (cumin, harissa, sel, poivre).",
        "Verser de l'eau et ajouter les légumes et les pois chiches.",
        "Laisser mijoter le bouillon pendant environ 30 minutes.",
        "Ajouter les morceaux de poisson (mérou ou dorade) et poursuivre la cuisson 10-15 minutes.",
        "Préparer la semoule selon les instructions du paquet, idéalement à la vapeur.",
        "Dresser la semoule dans un plat et verser le bouillon de poisson et légumes par-dessus.",
        "Décorer avec de la coriandre fraîche ciselée.",
        "Servir chaud avec un peu de harissa supplémentaire à côté."
      ],
      origins: ['Tunisie'],
      recipetype:['plat'],
      servings: 6,
      description: 'Le couscous au poisson est une spécialité tunisienne provenant des régions côtières. La semoule est servie avec un bouillon épicé à la harissa, des légumes et du poisson frais. Ce plat léger et parfumé est particulièrement apprécié en été.'
    },
    {
      id:22,
      title: 'Mloukhiya',
      image: "assets/images/mloukhiya.jpg",
      preptime: 120,
      ingredients: [
        { name: 'Viande d\'agneau', quantity: 700 },
        { name: 'Feuilles de mloukhiya séchées et réduites en poudre', quantity: 200 },
        { name: 'Pois chiches', quantity: 200 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Ail', quantity: 30 },
        { name: 'Tomate concentrée', quantity: 50 },
        { name: 'Cumin', quantity: 10 },
        { name: 'Coriandre en poudre', quantity: 10 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Faire revenir la viande avec les oignons et l'ail dans l'huile.",
        "Ajouter les épices et la tomate concentrée.",
        "Couvrir d'eau et laisser mijoter 1 heure.",
        "Ajouter la poudre de mloukhiya en pluie tout en remuant.",
        "Incorporer les pois chiches cuits.",
        "Laisser épaissir à feu doux 30 minutes en remuant souvent.",
        "Servir avec du pain ou du riz blanc."
      ],
      origins: ['Tunisie'],
      recipetype:['plat'],
      servings: 6,
      description: 'La Mloukhiya est un plat traditionnel tunisien à base de feuilles de corète séchées et réduites en poudre, mijotées avec de la viande d\'agneau. Cette sauce épaisse et savoureuse est généralement servie avec du riz ou du pain.'
    },
    {
      id: 23,
      title: 'Tajine El Bey',
      image: 'assets/images/tajine-el-bey.jpg',
      preptime: 90,
      ingredients: [
        { name: 'Viande d\'agneau hachée', quantity: 500 },
        { name: 'Œufs', quantity: 300 },
        { name: 'Fromage râpé', quantity: 200 },
        { name: 'Persil', quantity: 50 },
        { name: 'Oignons', quantity: 200 },
        { name: 'Pommes de terre', quantity: 300 },
        { name: 'Huile d\'olive', quantity: 50 },
        { name: 'Cannelle', quantity: 5 },
        { name: 'Cumin', quantity: 5 },
        { name: 'Sel', quantity: 10 },
        { name: 'Poivre', quantity: 5 }
      ],
      preparationSteps: [
        "Faire revenir les oignons dans l'huile.",
        "Ajouter la viande hachée et les épices, bien faire dorer.",
        "Disposer des tranches de pommes de terre au fond d'un plat à tajine.",
        "Répartir la viande hachée sur les pommes de terre.",
        "Battre les œufs avec le fromage et verser sur la viande.",
        "Saupoudrer de persil haché.",
        "Cuire au four à 180°C pendant 45 minutes."
      ],
      origins: ['Tunisie'],
      recipetype:['plat'],
      servings: 6,
      description: 'Le Tajine El Bey est un gratin tunisien à base de viande hachée, de pommes de terre et d\'œufs. Ce plat riche est parfumé avec des épices et garni de fromage râpé pour créer une croûte dorée délicieuse.'
    },
    {
      id: 24,
    title: "Fricassée tunisienne",
    image: "assets/images/fricassee.jpg",
    preptime: 60,
    ingredients: [
      { name: "Farine", quantity: 500 },
      { name: "Levure de boulanger", quantity: 1 },
      { name: "Sel", quantity: 1 },
      { name: "Huile", quantity: 3 },
      { name: "Œufs", quantity: 3 },
      { name: "Thon", quantity: 200 },
      { name: "Pommes de terre", quantity: 3 },
      { name: "Olives", quantity: 100 },
      { name: "Harissa", quantity: 2 },
      { name: "Câpres", quantity: 50 }
    ],
    preparationSteps: [
      "Préparer la pâte avec farine, levure, sel et eau.",
      "Laisser reposer 1 heure puis diviser en petites boules.",
      "Étaler chaque boule très finement et frire dans l'huile.",
      "Écraser les pommes de terre cuites avec du sel et de l'harissa.",
      "Garnir les pains frits avec thon, pommes de terre, œufs durs, olives et câpres.",
      "Servir chaud ou froid."
    ],
    origins: ['Tunisie'],
    recipetype:['plat'],
    servings: 8,
    description: "La fricassée tunisienne est un sandwich populaire composé d'un petit pain frit garni de thon, d'œufs durs, de pommes de terre, d'olives et d'harissa. C'est un en-cas très apprécié dans toute la Tunisie, notamment comme street food."
  },
  {
    id: '25',
    title: "Mlawi tunisien",
    image: "assets/images/mlawi.jpg",
    preptime: 90,
    ingredients: [
      { name: "Farine", quantity: 500 },
      { name: "Sel", quantity: 1 },
      { name: "Eau", quantity: 250 },
      { name: "Huile", quantity: 4 },
      { name: "Margarine", quantity: 200 }
    ],
    preparationSteps: [
      "Pétrir la farine avec le sel et l'eau pour obtenir une pâte souple.",
      "Diviser en boules et laisser reposer 30 minutes.",
      "Étaler chaque boule très finement en rectangle.",
      "Badigeonner de margarine fondue et plier plusieurs fois.",
      "Cuire sur plaque chaude des deux côtés jusqu'à dorure.",
      "Servir chaud avec du miel ou de la confiture."
    ],
    origins: ['Tunisie'],
    recipetype:['plat'],
    servings: 6,
    description: "Le mlawi est une sorte de crêpe feuilletée tunisienne qui ressemble au msemen marocain. Ces galettes sont préparées avec de la pâte très fine étalée puis pliée plusieurs fois avant d'être cuite sur une plaque chaude. Elles sont généralement servies au petit-déjeuner ou pour accompagner des plats en sauce."
  },
  {
    id: '26',
    title: "Baklawa tunisienne",
    image: "assets/images/baklawa.jpg",
    preptime: 120,
    ingredients: [
      { name: "Pâte filo", quantity: 500 },
      { name: "Amandes moulues", quantity: 500 },
      { name: "Sucre", quantity: 300 },
      { name: "Eau de fleur d'oranger", quantity: 2 },
      { name: "Beurre fondu", quantity: 250 },
      { name: "Miel", quantity: 200 },
      { name: "Pistaches concassées", quantity: 100 }
    ],
    preparationSteps: [
      "Mélanger les amandes avec le sucre et l'eau de fleur d'oranger.",
      "Beurrer un moule et disposer des feuilles de pâte filo en les badigeonnant de beurre.",
      "Étaler la farce aux amandes sur la moitié des feuilles.",
      "Recouvrir avec le reste des feuilles en beurrant chaque couche.",
      "Couper en losanges avant cuisson.",
      "Enfourner à 180°C pendant 30 minutes.",
      "Verser le miel chaud sur la baklawa à la sortie du four."
    ],
    origins: ['Tunisie'],
    recipetype:['dessert'],
    servings: 20,
    description: "La baklawa tunisienne est un dessert traditionnel composé de fines couches de pâte filo beurrées, farcies d'amandes moulues et nappées de sirop sucré. La version tunisienne se distingue souvent par l'utilisation d'eau de fleur d'oranger et une forme différente de la version turque ou libanaise."
  },
  {
    id: '27',
    title: "Zlabia tunisienne",
    image: "assets/images/zlabia.jpg",
    preptime: 60,
    ingredients: [
      { name: "Farine", quantity: 500 },
      { name: "Levure de boulanger", quantity: 1 },
      { name: "Eau", quantity: 300 },
      { name: "Huile pour friture", quantity: 1000 },
      { name: "Sucre", quantity: 500 },
      { name: "Eau de rose", quantity: 2 },
      { name: "Colorant alimentaire", quantity: 1 }
    ],
    preparationSteps: [
      "Mélanger farine, levure et eau pour obtenir une pâte fluide.",
      "Laisser fermenter 1 heure.",
      "Ajouter le colorant alimentaire.",
      "Faire chauffer l'huile dans une poêle profonde.",
      "Former des spirales avec la pâte directement dans l'huile chaude.",
      "Frire jusqu'à ce qu'elles soient croustillantes.",
      "Tremper dans le sirop chaud parfumé à l'eau de rose.",
      "Laisser égoutter avant de servir."
    ],
    origins: ['Tunisie'],
    recipetype:['dessert'],
    servings: 15,
    description: "La zlabia est un dessert traditionnel tunisien très populaire pendant le mois de Ramadan. Il s'agit de beignets spiralés frits puis trempés dans un sirop sucré parfumé à l'eau de rose. Ils sont reconnaissables à leur forme et leur couleur vive, souvent orange ou rouge."
  },
  {
    id: '28',
    title: "Kâak warka",
    image: "assets/images/kaak_warka.jpg",
    preptime: 120,
    ingredients: [
      { name: "Farine", quantity: 500 },
      { name: "Beurre", quantity: 200 },
      { name: "Sucre", quantity: 100 },
      { name: "Œufs", quantity: 2 },
      { name: "Amandes moulues", quantity: 300 },
      { name: "Sucre glace", quantity: 100 },
      { name: "Eau de fleur d'oranger", quantity: 2 }
    ],
    preparationSteps: [
      "Préparer la pâte avec farine, beurre et œufs.",
      "Préparer la farce avec amandes, sucre et eau de fleur d'oranger.",
      "Étaler la pâte finement et découper des cercles.",
      "Déposer de la farce au centre et former des anneaux.",
      "Dorer à l'œuf et enfourner à 180°C pendant 25 minutes.",
      "Saupoudrer de sucre glace à la sortie du four."
    ],
    origins: ['Tunisie'],
    recipetype:['dessert'],
    servings: 12,
    description: "Le kâak warka est une pâtisserie tunisienne en forme d'anneau, garnie d'une délicieuse farce aux amandes parfumée à l'eau de fleur d'oranger. Ce gâteau est traditionnellement servi lors des fêtes et des cérémonies, notamment les mariages."
  },
  {
    id: '29',
    title: "Zouza tunisienne",
    image: "assets/images/zouza.jpg",
    preptime: 90,
    ingredients: [
      { name: "Farine", quantity: 500 },
      { name: "Beurre", quantity: 250 },
      { name: "Sucre", quantity: 200 },
      { name: "Œufs", quantity: 3 },
      { name: "Amandes moulues", quantity: 400 },
      { name: "Eau de fleur d'oranger", quantity: 3 },
      { name: "Sucre glace", quantity: 100 }
    ],
    preparationSteps: [
      "Préparer la pâte sablée avec farine, beurre et sucre.",
      "Préparer la farce aux amandes parfumée à l'eau de fleur d'oranger.",
      "Étaler la pâte et découper des demi-lunes.",
      "Garnir chaque demi-lune de farce et coller deux demi-lunes ensemble.",
      "Cuire à 160°C pendant 20 minutes.",
      "Saupoudrer généreusement de sucre glace."
    ],
    
    origins: ['Tunisie'],
    recipetype:['dessert'],
    servings: 15,
    description: "La zouza est une pâtisserie tunisienne délicate composée de deux biscuits en forme de demi-lunes collés ensemble avec une garniture aux amandes. Ces petits gâteaux sont généralement recouverts de sucre glace et sont très populaires lors des fêtes de l'Aïd."
  },
  {
    id: '30',
    title: "Mkharek tunisiens",
    image: "assets/images/Mkharek.jpg",
    preptime: 75,
    ingredients: [
      { name: "Farine", quantity: 500 },
      { name: "Beurre", quantity: 200 },
      { name: "Huile", quantity: 3 },
      { name: "Œufs", quantity: 2 },
      { name: "Sucre", quantity: 150 },
      { name: "Levure chimique", quantity: 1 },
      { name: "Vanille", quantity: 1 },
      { name: "Sucre glace", quantity: 100 }
    ],
    preparationSteps: [
      "Mélanger la farine avec le beurre ramolli.",
      "Ajouter les œufs, le sucre et la vanille.",
      "Former une pâte homogène et laisser reposer 30 minutes.",
      "Diviser en petites boules et former des torsades ou des 8.",
      "Dorer à l'œuf et saupoudrer de sucre glace.",
      "Cuire à 180°C pendant 15-20 minutes."
    ],
    origins: ['Tunisie'],
    recipetype:['dessert'],
    servings: 20,
    description: "Les mkharek sont des biscuits tunisiens torsadés ou en forme de 8, très appréciés pour leur texture friable et leur goût délicat. Ils sont souvent saupoudrés de sucre glace et servis avec du thé à la menthe lors des occasions spéciales et des réunions familiales."
  }
];
// Fonction pour peupler la base de données
async function seedDatabase() {
    try {
      // Connexion à MongoDB
      await mongoose.connect(mongoURI);
      console.log('Connecté à MongoDB');
      
      // Supprimer toutes les recettes existantes
      await Recipe.deleteMany({});
      console.log('Base de données nettoyée');
      
      // Ajouter les nouvelles recettes
      await Recipe.insertMany(recipes);
      console.log('Base de données peuplée avec succès: ' + recipes.length + ' recettes ajoutées');
      
      // Déconnexion
      await mongoose.disconnect();
      console.log('Déconnecté de MongoDB');
      
    } catch (error) {
      console.error('Erreur lors du peuplement de la base de données:', error);
    }
  }
  
  // Exécuter la fonction
  seedDatabase();