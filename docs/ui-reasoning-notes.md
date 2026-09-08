# Notes de conception — Google Ads Calculator

Ces notes retracent les choix de conception réalisés pendant la construction de l’interface. Elles servent de mémoire de projet et de matière première pour un futur article de blog.

## 1. Concevoir un outil de décision, pas une landing page

Le calculateur doit aider le visiteur à décider si Google Ads mérite d’être testé dans son activité. La page ne cherche donc pas à vendre immédiatement une campagne ou une prestation.

Conséquences retenues :

- un hero court ;
- le calculateur visible rapidement ;
- peu de cartes et aucun dashboard générique ;
- des résultats présentés comme des conclusions ;
- les explications détaillées placées après le calculateur.

Le parcours doit donner l’impression de construire progressivement un modèle économique, et non de remplir un tableur.

## 2. Faire suivre à la copie le même raisonnement que l’interface

La première version utilisait rapidement des termes comme `CPA`, `lead`, `closing` et `taux de conversion`. Ces expressions sont utiles pour les professionnels, mais elles ne doivent pas porter la compréhension principale.

La règle adoptée est :

> questions simples → chiffres contextualisés → phrase de synthèse → terme technique discret

Les termes professionnels peuvent rester comme annotations : `CPA`, `CPC`, `taux de conversion`. Le texte principal parle plutôt de nouveaux clients, de personnes intéressées, de prises de contact, de trafic et de budget.

Le mot « prospect » est introduit seulement après avoir été défini par une phrase compréhensible.

## 3. Le parcours en quatre étapes

### 01 — Valeur d’un nouveau client

Cette étape établit la réalité économique actuelle avant de parler de publicité :

- chiffre d’affaires moyen par nouveau client ;
- marge moyenne.

La synthèse transforme les deux réponses en une phrase : un client génère un certain chiffre d’affaires, dont une certaine marge.

### 02 — Objectif de vente

Cette étape précise :

- le nombre de nouveaux clients visés ;
- la période de référence de cet objectif ;
- la marge minimale que l’entreprise souhaite conserver par client.

Les choix « par mois », « par trimestre » et « par an » expriment techniquement une périodicité. Le brief Beta conserve toutefois le label plus familier « Période » dans l’interface.

Deux approches ont été envisagées pour la marge minimale : un pourcentage de la marge ou un montant absolu. Le pourcentage s’adapte automatiquement lorsque la valeur moyenne d’un client évolue, mais le montant exprime plus directement le minimum concret que l’entreprise veut conserver. Le brief Beta retient donc un montant. L’interface restitue ensuite le coût d’acquisition maximal par client et le budget d’acquisition maximal.

Une lecture en pourcentage a été testée sous l’input, puis retirée. Isolée à cet endroit, elle ajoutait une information parallèle sans faciliter directement la décision. La synthèse regroupe plutôt la marge minimale par client, la marge totale estimée après publicité et le coût d’acquisition maximal. Les pourcentages pourront être réintroduits plus tard si les tests montrent qu’ils améliorent réellement la compréhension.

### 03 — Conversion commerciale

Cette étape isole le passage d’une personne réellement intéressée à un nouveau client. Elle évite de mélanger la performance commerciale et la performance de la page.

La question principale est formulée concrètement : sur dix personnes intéressées, combien deviennent clientes ? Le résultat introduit ensuite le nombre de prospects nécessaires.

### 04 — Acquisition Google Ads

La dernière étape relie l’objectif commercial au trafic :

- taux de conversion de la page ;
- coût estimé par clic.

Elle restitue le nombre de clics nécessaires puis le budget publicitaire estimé. L’aide « Je ne connais pas ce chiffre » reste visible sous le coût par clic, car l’utilisateur peut légitimement ne pas avoir encore cette donnée.

## 4. Présenter les résultats comme des conclusions

Les résultats intermédiaires ne doivent pas ressembler à des cellules de tableur ni à des cartes de dashboard. Chaque groupe de questions produit une phrase complète dans laquelle les chiffres importants sont mis en évidence.

Une bordure verticale et une différence de taille typographique suffisent à distinguer ces synthèses. Le jargon apparaît en annotation, sous la phrase.

Chaque synthèse se termine par une bande de chiffres clés. Contrairement aux phrases principales, cette zone assume le vocabulaire des spécialistes PPC et marketing : CPA, CPC, CPL, CVR, taux de closing et budget média. Elle offre une lecture experte en parallèle sans imposer ce jargon au reste du parcours. Cette répétition rend les sections comparables sans transformer la page en dashboard.

Le résultat final suit cet ordre :

1. conclusion en langage courant ;
2. justification par le budget acceptable et le budget estimé ;
3. comparaison du coût par nouveau client ;
4. métriques de synthèse.

La formulation reste prudente. Un scénario favorable « mérite d’être testé » ; l’outil ne promet jamais une rentabilité.

Le résultat doit aussi ouvrir naturellement vers Tanea : vérification du scénario, discussion sur les hypothèses ou préparation d’une campagne cadrée. Cette transition commerciale doit rester secondaire par rapport à la réponse fournie par l’outil.

## 5. Donner une idée claire de l’effort demandé

Une longue méthodologie avant le calculateur ajouterait de la friction et contredirait la promesse d’un outil accessible rapidement. En revanche, une courte introduction réduit l’incertitude avant de commencer.

La solution retenue est un bandeau compact :

> 4 étapes · environ 3 minutes.

Il résume ensuite le parcours en une phrase. Le nombre de questions a volontairement été retiré : la durée et le nombre d’étapes suffisent à rassurer sans donner une impression de formulaire administratif.

La méthodologie complète reste après le résultat, au moment où l’utilisateur peut vouloir comprendre ou vérifier la conclusion.

## 6. Hiérarchie typographique

La hiérarchie ne repose pas sur des textes gris. Tous les textes utilisent un noir dense ; leur rôle est exprimé par la taille, le poids, la casse et l’espacement.

Les tailles proviennent d’Open Props :

- `--font-size-0` est réservé aux métadonnées, numéros, unités et annotations techniques ;
- `--font-size-1` est le minimum pour les labels et le texte courant ;
- les chiffres et conclusions utilisent les niveaux supérieurs.

Les explications sont placées entre le label et le champ. L’utilisateur comprend ainsi la donnée attendue avant de rencontrer le contrôle. Une hauteur minimale commune évite les décalages entre deux champs voisins lorsque leurs explications occupent un nombre de lignes différent.

## 7. Responsive et progression

Sur ordinateur, les champs occupent la colonne gauche et le scénario reste visible dans un panneau sticky à droite.

Sur mobile :

- les champs passent sur une seule colonne ;
- les synthèses apparaissent entre les groupes de questions ;
- le résultat final est intégré après la dernière étape ;
- une navigation sticky indique les quatre étapes et l’étape actuellement visible.

L’objectif est d’éviter une longue série de champs sans retour intermédiaire. Aucun scroll forcé n’est nécessaire.

## 8. Bibliothèque de composants : décision encore ouverte

L’approche la plus légère reste :

- composants Astro internes ;
- contrôles HTML natifs ;
- Open Props pour les tokens ;
- JavaScript limité au calcul et à la navigation.

Cette solution maximise les performances et permet une direction visuelle très spécifique. Les problèmes d’alignement relèvent toutefois de notre système de grille et de composants ; une bibliothèque ne les corrigera pas automatiquement.

Web Awesome reste une option crédible pour améliorer les contrôles, les états de focus, la validation et les futurs composants complexes. Ses contreparties sont le JavaScript client, le runtime des Web Components, des styles supplémentaires et une personnalisation plus délicate à travers le Shadow DOM.

La stratégie envisagée est un prototype limité :

1. remplacer les champs d’une seule étape par les composants Web Awesome équivalents ;
2. importer uniquement les composants utilisés ;
3. conserver la structure et les résultats en Astro ;
4. mesurer le poids JavaScript, le LCP, le CLS et l’expérience clavier ;
5. étendre la solution seulement si le gain visuel et le gain d’accessibilité justifient le coût.

### Documentation du benchmark

Le benchmark fera partie de la documentation du projet et du futur article. Il comparera deux versions construites à partir du même écran :

- la version de référence avec composants Astro et contrôles HTML natifs ;
- le prototype utilisant des composants Web Awesome importés individuellement.

Chaque mesure devra préciser :

- les versions d’Astro, de Web Awesome et du navigateur ;
- la commande et le mode de build utilisés ;
- l’appareil ou l’émulation, la taille d’écran et les conditions réseau ;
- les composants Web Awesome réellement importés ;
- la taille transférée du JavaScript et du CSS, ainsi que leur taille compressée ;
- le LCP, le CLS et le temps de blocage mesurés dans les mêmes conditions ;
- le délai avant que les contrôles soient visibles et utilisables ;
- la navigation clavier, la visibilité du focus, les labels et les messages d’erreur ;
- les éventuels décalages visuels pendant la définition des Web Components ;
- l’effort nécessaire pour reproduire la direction visuelle avec les deux approches.

Les résultats seront conservés sous forme de tableau avant/après, accompagnés de captures desktop et mobile et des rapports bruts. La décision finale devra distinguer les mesures observées des impressions subjectives sur la qualité de l’interface.

Aucune conclusion ne sera prise sur la seule taille du package installé : le critère pertinent est ce qui est réellement envoyé et exécuté sur la page de production.

Un écran de chargement couvrant toute la page n’est pas privilégié. Il masquerait du contenu HTML déjà disponible et dégraderait la performance perçue. Si Web Awesome est testé, il vaut mieux réserver la hauteur des contrôles et gérer uniquement leur état avant définition.

## 9. Principes à conserver

- Commencer par la réalité économique de l’entreprise, pas par le budget publicitaire.
- Ne demander qu’une donnée dont l’effet peut être expliqué immédiatement.
- Expliquer avant de nommer avec du jargon.
- Montrer une conclusion avant une liste de métriques.
- Ne jamais confondre estimation de viabilité et promesse de rentabilité.
- Rendre visible la progression sans transformer la page en assistant lourd.
- Mesurer le coût réel d’une bibliothèque avant de l’adopter.

## 10. Points encore à valider

- Les seuils précis des états favorable, limite et défavorable.
- La définition définitive de « personne intéressée », « prise de contact » et « prospect ».
- Les aides proposées lorsque l’utilisateur ne connaît pas son coût par clic.
- Le comportement des résultats avant que tous les champs nécessaires soient renseignés.
- L’intérêt réel de Web Awesome après un prototype mesuré.
- La formulation et la destination exactes de l’appel à l’action vers Tanea.
